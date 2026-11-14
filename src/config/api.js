/**
 * Configuración central de la API REST
 * 
 * Este archivo centraliza la URL base del backend en Laravel desplegado en Render
 * y los endpoints consumidos por la aplicación móvil.
 */

export const API_BASE_URL = 'https://api-examen-final-ofvn.onrender.com/api';

// Tiempo máximo de espera en milisegundos (120 segundos para contemplar el arranque en frío de Render)
export const REQUEST_TIMEOUT_MS = 120000;

export const ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/health`,
  CATEGORIAS: `${API_BASE_URL}/categorias`,
  CURSOS: `${API_BASE_URL}/cursos`,
  // Función para obtener la URL de un curso específico por su ID
  CURSO_DETALLE: (id) => `${API_BASE_URL}/cursos/${id}`,
  // Función para obtener la URL de cursos filtrados por categoría
  CURSOS_POR_CATEGORIA: (categoriaId) => `${API_BASE_URL}/cursos?categoria_id=${categoriaId}`,
};
