import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../styles/theme';

/**
 * Componente reutilizable para presentación de errores
 * Muestra el mensaje del error y un botón destacado para reintentar la acción.
 */
export default function ErrorView({
  mensaje = 'Ocurrió un error al cargar la información.',
  onRetry,
  textoBoton = 'Reintentar',
}) {
  return (
    <View style={styles.contenedor}>
      <View style={styles.tarjeta}>
        <View style={styles.iconoContenedor}>
          <Text style={styles.icono}>⚠️</Text>
        </View>
        <Text style={styles.titulo}>Atención</Text>
        <Text style={styles.mensaje}>{mensaje}</Text>
        {onRetry ? (
          <TouchableOpacity
            style={styles.boton}
            onPress={onRetry}
            activeOpacity={0.8}
          >
            <Text style={styles.botonTexto}>{textoBoton}</Text>
          </TouchableOpacity>
        ) : null}
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
  iconoContenedor: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.dangerLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  icono: {
    fontSize: 28,
  },
  titulo: {
    ...typography.h3,
    color: colors.danger,
    marginBottom: spacing.xs,
  },
  mensaje: {
    ...typography.bodySecondary,
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  boton: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  botonTexto: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
