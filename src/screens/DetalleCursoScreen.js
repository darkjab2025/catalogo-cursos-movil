import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors, spacing, typography, shadows } from '../styles/theme';
import { obtenerCursoPorId } from '../services/catalogoService';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';

/**
 * Pantalla 3: Detalle del Curso
 * Consulta el endpoint real GET /api/cursos/{id} a partir del ID recibido en los parámetros.
 */
export default function DetalleCursoScreen({ route, navigation }) {
  const { id } = route.params || {};

  const [curso, setCurso] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarDetalle = useCallback(async () => {
    if (!id) {
      setError('No se proporcionó un identificador de curso válido.');
      setCargando(false);
      return;
    }

    try {
      setError(null);
      const datosCurso = await obtenerCursoPorId(id);
      setCurso(datosCurso);
    } catch (err) {
      setError(err.message || 'No se pudo obtener el detalle del curso.');
    } finally {
      setCargando(false);
    }
  }, [id]);

  useEffect(() => {
    setCargando(true);
    cargarDetalle();
  }, [cargarDetalle]);

  // Estilos según el nivel académico
  const obtenerEstiloNivel = (nivel) => {
    switch (nivel?.toLowerCase()) {
      case 'principiante':
        return { bg: colors.levelPrincipianteBg, text: colors.levelPrincipianteText };
      case 'intermedio':
        return { bg: colors.levelIntermedioBg, text: colors.levelIntermedioText };
      case 'avanzado':
        return { bg: colors.levelAvanzadoBg, text: colors.levelAvanzadoText };
      default:
        return { bg: colors.accentLight, text: colors.accent };
    }
  };

  if (cargando) {
    return (
      <LoadingView
        mensaje={`Cargando curso #${id}...`}
        submensaje="Consultando los detalles actualizados en la API de Render."
      />
    );
  }

  if (error || !curso) {
    return (
      <View style={styles.pantallaError}>
        <ErrorView
          mensaje={error || 'No fue posible cargar el curso.'}
          onRetry={() => {
            setCargando(true);
            cargarDetalle();
          }}
          textoBoton="Reintentar consulta"
        />
        <TouchableOpacity
          style={styles.botonRegresarError}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.textoBotonRegresarError}>← Volver al listado</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const estiloNivel = obtenerEstiloNivel(curso.nivel);

  return (
    <ScrollView
      style={styles.pantalla}
      contentContainerStyle={styles.contenido}
      showsVerticalScrollIndicator={false}
    >
      {/* Tarjeta Principal del Curso */}
      <View style={styles.tarjetaPrincipal}>
        {/* Fila Superior: ID y Nivel */}
        <View style={styles.filaSuperior}>
          <View style={styles.badgeId}>
            <Text style={styles.textoBadgeId}>CURSO #{curso.id}</Text>
          </View>
          <View style={[styles.badgeNivel, { backgroundColor: estiloNivel.bg }]}>
            <Text style={[styles.textoBadgeNivel, { color: estiloNivel.text }]}>
              {curso.nivel}
            </Text>
          </View>
        </View>

        {/* Nombre completo */}
        <Text style={styles.nombreCompleto}>{curso.nombre}</Text>

        {/* Duración */}
        <View style={styles.cajaDuracion}>
          <Text style={styles.iconoDuracion}>⏱️</Text>
          <Text style={styles.textoDuracion}>
            Duración estimada: <Text style={styles.textoDuracionValor}>{curso.duracion_horas} horas académicas</Text>
          </Text>
        </View>

        <View style={styles.divisor} />

        {/* Descripción completa */}
        <Text style={styles.seccionTitulo}>Descripción del curso</Text>
        <Text style={styles.descripcionTexto}>{curso.descripcion}</Text>

        <View style={styles.divisor} />

        {/* Información de la Categoría */}
        <Text style={styles.seccionTitulo}>Área de conocimiento / Categoría</Text>
        <View style={styles.cajaCategoria}>
          <Text style={styles.categoriaNombre}>
            🏷️ {curso.categoria?.nombre || 'Categoría no especificada'}
          </Text>
          {curso.categoria?.descripcion ? (
            <Text style={styles.categoriaDescripcion}>
              {curso.categoria.descripcion}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Botones de Navegación */}
      <View style={styles.seccionBotones}>
        <TouchableOpacity
          style={styles.botonRegresar}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotonRegresar}>← Volver al listado</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pantallaError: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contenido: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  tarjetaPrincipal: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
    marginBottom: spacing.md,
  },
  filaSuperior: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  badgeId: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  textoBadgeId: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  badgeNivel: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  textoBadgeNivel: {
    fontSize: 12,
    fontWeight: '700',
  },
  nombreCompleto: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryDark,
    lineHeight: 28,
    marginBottom: spacing.md,
  },
  cajaDuracion: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconoDuracion: {
    fontSize: 18,
    marginRight: 8,
  },
  textoDuracion: {
    ...typography.bodySecondary,
    color: colors.textSecondary,
  },
  textoDuracionValor: {
    fontWeight: '700',
    color: colors.primary,
  },
  divisor: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: spacing.md,
  },
  seccionTitulo: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  descripcionTexto: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  cajaCategoria: {
    backgroundColor: '#f0f9ff',
    borderRadius: 10,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#bae6fd',
    marginTop: 4,
  },
  categoriaNombre: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 4,
  },
  categoriaDescripcion: {
    ...typography.bodySecondary,
    color: colors.textSecondary,
  },
  seccionBotones: {
    marginTop: spacing.sm,
  },
  botonRegresar: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    ...shadows.card,
  },
  textoBotonRegresar: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  botonRegresarError: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  textoBotonRegresarError: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
});
