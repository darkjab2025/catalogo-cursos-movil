import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../styles/theme';

/**
 * Componente reutilizable para estados de carga
 * Informa al usuario sobre posibles demoras derivadas del arranque en frío de Render.
 */
export default function LoadingView({
  mensaje = 'Cargando información...',
  submensaje = 'Conectando con el servidor. La primera consulta puede tardar un poco mientras se activa el servicio en Render.',
}) {
  return (
    <View style={styles.contenedor}>
      <View style={styles.tarjeta}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.mensaje}>{mensaje}</Text>
        {submensaje ? <Text style={styles.submensaje}>{submensaje}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  tarjeta: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
    maxWidth: 340,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  mensaje: {
    ...typography.h3,
    marginTop: spacing.md,
    textAlign: 'center',
    color: colors.primary,
  },
  submensaje: {
    ...typography.bodySecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});
