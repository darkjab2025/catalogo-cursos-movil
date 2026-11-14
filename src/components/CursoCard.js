import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography, shadows } from '../styles/theme';

/**
 * Tarjeta de presentación para un curso dentro de una FlatList
 * 
 * @param {object} curso - Objeto con datos reales devueltos por Laravel
 * @param {function} onPress - Callback al presionar para ver el detalle
 */
export default function CursoCard({ curso, onPress }) {
  if (!curso) return null;

  // Determinar los colores del badge según el nivel del curso
  const obtenerEstiloNivel = (nivel) => {
    switch (nivel?.toLowerCase()) {
      case 'principiante':
        return {
          bg: colors.levelPrincipianteBg,
          text: colors.levelPrincipianteText,
        };
      case 'intermedio':
        return {
          bg: colors.levelIntermedioBg,
          text: colors.levelIntermedioText,
        };
      case 'avanzado':
        return {
          bg: colors.levelAvanzadoBg,
          text: colors.levelAvanzadoText,
        };
      default:
        return {
          bg: colors.accentLight,
          text: colors.accent,
        };
    }
  };

  const estiloNivel = obtenerEstiloNivel(curso.nivel);

  return (
    <TouchableOpacity
      style={styles.tarjeta}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalle del curso ${curso.nombre}`}
    >
      {/* Encabezado: Categoría y Nivel */}
      <View style={styles.header}>
        <View style={styles.badgeCategoria}>
          <Text style={styles.badgeCategoriaTexto}>
            {curso.categoria?.nombre || 'General'}
          </Text>
        </View>

        <View style={[styles.badgeNivel, { backgroundColor: estiloNivel.bg }]}>
          <Text style={[styles.badgeNivelTexto, { color: estiloNivel.text }]}>
            {curso.nivel}
          </Text>
        </View>
      </View>

      {/* Nombre del curso */}
      <Text style={styles.nombre} numberOfLines={2}>
        {curso.nombre}
      </Text>

      {/* Descripción resumida */}
      <Text style={styles.descripcion} numberOfLines={2}>
        {curso.descripcion}
      </Text>

      {/* Pie de tarjeta: Duración y botón de acción */}
      <View style={styles.footer}>
        <View style={styles.duracionContenedor}>
          <Text style={styles.iconoReloj}>⏱️</Text>
          <Text style={styles.duracionTexto}>{curso.duracion_horas} horas</Text>
        </View>

        <View style={styles.botonDetalle}>
          <Text style={styles.botonDetalleTexto}>Ver detalle →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badgeCategoria: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeCategoriaTexto: {
    ...typography.badge,
    color: colors.primary,
  },
  badgeNivel: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeNivelTexto: {
    ...typography.badge,
  },
  nombre: {
    ...typography.h3,
    color: colors.primaryDark,
    marginBottom: spacing.xs,
  },
  descripcion: {
    ...typography.bodySecondary,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  duracionContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconoReloj: {
    fontSize: 14,
    marginRight: 4,
  },
  duracionTexto: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  botonDetalle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  botonDetalleTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
  },
});
