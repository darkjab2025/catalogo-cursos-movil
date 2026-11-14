/**
 * Definición visual y estilos temáticos del Catálogo Académico
 * Paleta de colores académica: azul marino oscuro, azul claro de acento y fondos neutros.
 */

export const colors = {
  primary: '#0f2942',        // Azul marino oscuro institucional
  primaryDark: '#0a1d30',    // Tono más oscuro para cabeceras y contrastes
  accent: '#0284c7',         // Azul claro para botones y elementos interactivos
  accentLight: '#e0f2fe',    // Fondo suave para elementos resaltados
  background: '#f8fafc',     // Fondo principal gris muy claro
  card: '#ffffff',           // Fondo blanco para tarjetas y contenedores
  textPrimary: '#0f172a',    // Texto principal oscuro de alta legibilidad
  textSecondary: '#64748b',  // Texto secundario para etiquetas y descripciones
  textMuted: '#94a3b8',      // Texto tenue para detalles menores
  border: '#e2e8f0',         // Color sutil para divisores y bordes de tarjeta
  
  // Estados y alertas
  success: '#16a34a',        // Verde para estado de conexión exitoso
  successLight: '#dcfce7',
  warning: '#d97706',        // Ámbar para advertencias
  warningLight: '#fef3c7',
  danger: '#dc2626',         // Rojo para errores
  dangerLight: '#fee2e2',

  // Colores para los niveles de los cursos
  levelPrincipianteBg: '#e0f2fe',
  levelPrincipianteText: '#0369a1',
  levelIntermedioBg: '#fef3c7',
  levelIntermedioText: '#b45309',
  levelAvanzadoBg: '#fee2e2',
  levelAvanzadoText: '#b91c1c',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  h1: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  h2: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  h3: { fontSize: 17, fontWeight: '600', color: colors.textPrimary },
  body: { fontSize: 14, color: colors.textPrimary, lineHeight: 20 },
  bodySecondary: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  caption: { fontSize: 12, color: colors.textMuted },
  badge: { fontSize: 11, fontWeight: '600' },
};

export const shadows = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHover: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
};
