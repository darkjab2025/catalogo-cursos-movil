import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, typography, shadows } from '../styles/theme';
import { obtenerEstadoServidor, obtenerCursos } from '../services/catalogoService';

/**
 * Pantalla 1: Inicio
 * Bienvenida, métricas del catálogo e indicador en tiempo real de la API en Render.
 */
export default function InicioScreen({ navigation }) {
  const [cargandoSalud, setCargandoSalud] = useState(true);
  const [estadoSalud, setEstadoSalud] = useState(null);
  const [totalCursos, setTotalCursos] = useState(null);
  const [cargandoCursos, setCargandoCursos] = useState(false);

  // Consulta el estado de salud de la API
  const verificarEstadoApi = async () => {
    setCargandoSalud(true);
    const resultado = await obtenerEstadoServidor();
    setEstadoSalud(resultado);
    setCargandoSalud(false);
  };

  // Consulta la cantidad de cursos disponibles
  const cargarResumenCursos = async () => {
    try {
      setCargandoCursos(true);
      const cursos = await obtenerCursos();
      setTotalCursos(cursos.length);
    } catch (error) {
      setTotalCursos(null);
    } finally {
      setCargandoCursos(false);
    }
  };

  useEffect(() => {
    verificarEstadoApi();
    cargarResumenCursos();
  }, []);

  return (
    <ScrollView
      style={styles.pantalla}
      contentContainerStyle={styles.contenido}
      showsVerticalScrollIndicator={false}
    >
      {/* Encabezado Principal */}
      <View style={styles.banner}>
        <Text style={styles.subtituloBanner}>APLICACIÓN MÓVIL UNIVERSITARIA</Text>
        <Text style={styles.tituloBanner}>Catálogo Académico</Text>
        <Text style={styles.descripcionBanner}>
          Plataforma de referencia para la consulta y exploración de la oferta formativa técnica,
          desarrollada con React Native y Expo para consumir servicios REST en Laravel.
        </Text>
      </View>

      {/* Tarjeta de Estado de Conexión en Tiempo Real */}
      <View style={styles.tarjetaEstado}>
        <View style={styles.cabeceraTarjeta}>
          <Text style={styles.tituloTarjeta}>Estado de la API en Render</Text>
          <TouchableOpacity
            onPress={verificarEstadoApi}
            disabled={cargandoSalud}
            style={styles.botonRecargarSalud}
          >
            <Text style={styles.textoBotonRecargar}>Actualizar ⟳</Text>
          </TouchableOpacity>
        </View>

        {cargandoSalud ? (
          <View style={styles.filaEstado}>
            <ActivityIndicator size="small" color={colors.accent} />
            <Text style={styles.textoComprobando}>Verificando /api/health...</Text>
          </View>
        ) : (
          <View style={styles.filaEstado}>
            <View
              style={[
                styles.indicadorLuz,
                {
                  backgroundColor: estadoSalud?.exito
                    ? colors.success
                    : colors.danger,
                },
              ]}
            />
            <View style={styles.infoEstado}>
              <Text
                style={[
                  styles.textoEstado,
                  {
                    color: estadoSalud?.exito
                      ? colors.success
                      : colors.danger,
                  },
                ]}
              >
                {estadoSalud?.exito ? 'En línea y disponible' : 'Sin conexión con la API'}
              </Text>
              <Text style={styles.detalleEstado}>
                {estadoSalud?.message}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Resumen de Datos Disponibles */}
      <View style={styles.tarjetaResumen}>
        <Text style={styles.tituloTarjeta}>Resumen del Catálogo</Text>
        <View style={styles.contenedorMetrica}>
          <View style={styles.cajaMetrica}>
            {cargandoCursos ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.valorMetrica}>
                {totalCursos !== null ? totalCursos : '—'}
              </Text>
            )}
            <Text style={styles.etiquetaMetrica}>Cursos registrados</Text>
          </View>

          <View style={styles.cajaMetrica}>
            <Text style={styles.valorMetrica}>5</Text>
            <Text style={styles.etiquetaMetrica}>Categorías temáticas</Text>
          </View>
        </View>
      </View>

      {/* Botones de Navegación Principal */}
      <View style={styles.seccionAcciones}>
        <TouchableOpacity
          style={styles.botonPrincipal}
          onPress={() => navigation.navigate('Cursos')}
          activeOpacity={0.8}
        >
          <Text style={styles.iconoBoton}>📚</Text>
          <View style={styles.textosBoton}>
            <Text style={styles.textoBotonPrincipal}>Explorar Cursos</Text>
            <Text style={styles.subtextoBotonPrincipal}>
              Consulta los cursos disponibles en FlatList
            </Text>
          </View>
          <Text style={styles.flechaBoton}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botonSecundario}
          onPress={() => navigation.navigate('Categorias')}
          activeOpacity={0.8}
        >
          <Text style={styles.iconoBoton}>🏷️</Text>
          <View style={styles.textosBoton}>
            <Text style={styles.textoBotonSecundario}>Ver Categorías</Text>
            <Text style={styles.subtextoBotonSecundario}>
              Filtra cursos por área de conocimiento
            </Text>
          </View>
          <Text style={styles.flechaBotonSecundario}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botonDiagnostico}
          onPress={() => navigation.navigate('EstadoApi')}
          activeOpacity={0.8}
        >
          <Text style={styles.iconoBoton}>📡</Text>
          <View style={styles.textosBoton}>
            <Text style={styles.textoBotonDiagnostico}>Diagnóstico de la API</Text>
            <Text style={styles.subtextoBotonDiagnostico}>
              Prueba técnica de conexión para docentes
            </Text>
          </View>
          <Text style={styles.flechaBotonDiagnostico}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Pie de Pantalla */}
      <View style={styles.piePagina}>
        <Text style={styles.textoPie}>Desarrollo de Apps Multidispositivo I</Text>
        <Text style={styles.subtextoPie}>Modelo de examen final universitario</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contenido: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  banner: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  subtituloBanner: {
    fontSize: 11,
    fontWeight: '700',
    color: '#93c5fd',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  tituloBanner: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: spacing.sm,
  },
  descripcionBanner: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 19,
  },
  tarjetaEstado: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  cabeceraTarjeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tituloTarjeta: {
    ...typography.h3,
    color: colors.primary,
  },
  botonRecargarSalud: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: colors.accentLight,
  },
  textoBotonRecargar: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  filaEstado: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  indicadorLuz: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  infoEstado: {
    flex: 1,
  },
  textoEstado: {
    fontSize: 14,
    fontWeight: '700',
  },
  detalleEstado: {
    ...typography.caption,
    marginTop: 2,
  },
  textoComprobando: {
    ...typography.bodySecondary,
    marginLeft: 10,
  },
  tarjetaResumen: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  contenedorMetrica: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  cajaMetrica: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: spacing.md,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#edf2f7',
  },
  valorMetrica: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  etiquetaMetrica: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  seccionAcciones: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  botonPrincipal: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 12,
    ...shadows.card,
  },
  botonSecundario: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.accent,
    ...shadows.card,
  },
  botonDiagnostico: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  iconoBoton: {
    fontSize: 22,
    marginRight: spacing.md,
  },
  textosBoton: {
    flex: 1,
  },
  textoBotonPrincipal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  subtextoBotonPrincipal: {
    fontSize: 12,
    color: '#93c5fd',
    marginTop: 2,
  },
  flechaBoton: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
    marginLeft: 8,
  },
  textoBotonSecundario: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent,
  },
  subtextoBotonSecundario: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  flechaBotonSecundario: {
    fontSize: 18,
    color: colors.accent,
    fontWeight: '700',
    marginLeft: 8,
  },
  textoBotonDiagnostico: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  subtextoBotonDiagnostico: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  flechaBotonDiagnostico: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '700',
    marginLeft: 8,
  },
  piePagina: {
    alignItems: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  textoPie: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  subtextoPie: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});
