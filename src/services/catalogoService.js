/**
 * Servicio para consumo de la API REST del Catálogo Académico
 * 
 * Implementa peticiones HTTP con fetch(), async/await, manejo con try/catch/finally,
 * control de tiempo de espera (timeout) mediante AbortController para servidores en Render,
 * y validaciones completas de códigos HTTP y estructura de respuesta.
 */

import { ENDPOINTS, REQUEST_TIMEOUT_MS } from '../config/api.js';

/**
 * Realiza una petición fetch con timeout configurado mediante AbortController.
 * Valida estado HTTP, tipo de contenido y estructura JSON esperada.
 *
 * @param {string} url - URL del endpoint a consultar.
 * @param {object} options - Opciones adicionales para fetch.
 * @param {number} timeoutMs - Tiempo límite en milisegundos.
 * @returns {Promise<object>} Objeto con { status, data, message, raw }
 */
async function fetchConTimeout(url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const idTimeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const respuesta = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(options.headers || {}),
      },
    });

    // Intentar analizar la respuesta como JSON
    let json;
    const textoRespuesta = await respuesta.text();

    try {
      json = JSON.parse(textoRespuesta);
    } catch (parseError) {
      throw new Error(
        `El servidor no devolvió una respuesta JSON válida (Código HTTP ${respuesta.status}).`
      );
    }

    // Validar códigos HTTP de error específicos
    if (!respuesta.ok) {
      const mensajeServidor = json?.message || 'Error en la solicitud al servidor.';
      if (respuesta.status === 404) {
        throw new Error(mensajeServidor || 'El recurso solicitado no fue encontrado (404).');
      }
      if (respuesta.status === 422) {
        throw new Error(mensajeServidor || 'Datos no procesables por validación (422).');
      }
      if (respuesta.status >= 500) {
        throw new Error(`Error interno en el servidor (${respuesta.status}): ${mensajeServidor}`);
      }
      throw new Error(`Error en la petición (${respuesta.status}): ${mensajeServidor}`);
    }

    // Validar el campo de éxito de la API Laravel
    if (json.success === false) {
      throw new Error(json.message || 'La operación no fue completada por el servidor.');
    }

    return {
      status: respuesta.status,
      data: json.data,
      message: json.message || 'Operación exitosa',
      raw: json,
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(
        'El servidor tardó demasiado en responder (tiempo límite de 120s superado). Esto suele ocurrir cuando Render está iniciando el servicio desde reposo. Por favor, reintenta.'
      );
    }
    // Errores de conexión / sin acceso a internet
    if (
      error.message.includes('Network request failed') ||
      error.message.includes('Failed to fetch')
    ) {
      throw new Error(
        'No fue posible comunicarse con el servidor. Verifica tu conexión a Internet o el estado de la API.'
      );
    }
    throw error;
  } finally {
    clearTimeout(idTimeout);
  }
}

/**
 * Consulta el estado del servidor (Health Check)
 * Endpoint: GET /api/health
 */
export async function obtenerEstadoServidor() {
  try {
    const resultado = await fetchConTimeout(ENDPOINTS.HEALTH);
    return {
      exito: true,
      status: resultado.status,
      data: resultado.data,
      message: resultado.message,
    };
  } catch (error) {
    return {
      exito: false,
      status: error.status || 0,
      data: null,
      message: error.message || 'Error al conectar con la API.',
    };
  }
}

/**
 * Obtiene la lista completa de categorías
 * Endpoint: GET /api/categorias
 */
export async function obtenerCategorias() {
  const resultado = await fetchConTimeout(ENDPOINTS.CATEGORIAS);
  if (!Array.isArray(resultado.data)) {
    throw new Error('El formato de categorías recibido no es válido (se esperaba un arreglo).');
  }
  return resultado.data;
}

/**
 * Obtiene el listado de cursos, con soporte para filtrado opcional por categoría
 * Endpoint: GET /api/cursos ó GET /api/cursos?categoria_id={id}
 *
 * @param {number|string|null} categoriaId - ID de la categoría para filtrar (opcional)
 */
export async function obtenerCursos(categoriaId = null) {
  const url = categoriaId
    ? ENDPOINTS.CURSOS_POR_CATEGORIA(categoriaId)
    : ENDPOINTS.CURSOS;

  const resultado = await fetchConTimeout(url);

  if (!Array.isArray(resultado.data)) {
    throw new Error('El formato de cursos recibido no es válido (se esperaba un arreglo).');
  }

  return resultado.data;
}

/**
 * Obtiene el detalle completo de un curso por su ID
 * Endpoint: GET /api/cursos/{id}
 *
 * @param {number|string} id - Identificador del curso
 */
export async function obtenerCursoPorId(id) {
  if (!id) {
    throw new Error('Debe proporcionar un ID de curso válido.');
  }

  const url = ENDPOINTS.CURSO_DETALLE(id);
  const resultado = await fetchConTimeout(url);

  if (!resultado.data || typeof resultado.data !== 'object') {
    throw new Error('No se recibieron los datos del curso seleccionado.');
  }

  return resultado.data;
}
