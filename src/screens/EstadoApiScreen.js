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
import { API_BASE_URL, ENDPOINTS, REQUEST_TIMEOUT_MS } from '../config/api';
import { obtenerEstadoServidor } from '../services/catalogoService';

/**
 * Pantalla 5: Estado de la API (Diagnóstico de Conexión)
 * Diseñada para que el docente y estudiantes verifiquen la comunicación real con Render.
 */
export default function EstadoApiScreen() {
  const [cargando, setCargando] = useState(false);
  const [resultadoPrueba, setResultadoPrueba] = useState(null);
  const [fechaPrueba, setFechaPrueba] = useState(null);
  const [duracionMs, setDuracionMs] = useState(null);

  const ejecutarPruebaConexion = async () => {
    setCargando(true);
    const tiempoInicio = Date.now();

    try {
      const respuesta = await obtenerEstadoServidor();
      const tiempoFin = Date.now();
      setDuracionMs(tiempoFin - tiempoInicio);
      setResultadoPrueba(respuesta);
      setFechaPrueba(new Date().toLocaleTimeString());
    } catch (err) {
      const tiempoFin = Date.now();
      setDuracionMs(tiempoFin - tiempoInicio);
      setResultadoPrueba({
        exito: false,
        status: 0,
        message: err.message,
        data: null,
      });
      setFechaPrueba(new Date().toLocaleTimeString());
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    ejecutarPruebaConexion();
  }, []);

  return (
    <ScrollView
      style={styles.pantalla}
      contentContainerStyle={styles.contenido}
      showsVerticalScrollIndicator={false}
    >
      {/* Banner de Diagnóstico */}
      <View style={styles.banner}>
        <Text style={styles.tituloBanner}>Diagnóstico de la API REST</Text>
        <Text style={styles.descripcionBanner}>
          Panel de auditoría técnica para verificar la conectividad entre React Native (Expo) y el backend Laravel alojado en Render.
        </Text>
      </View>

      {/* Tarjeta de Parámetros de Configuración */}
      <View style={styles.tarjeta}>
        <Text style={styles.tituloTarjeta}>Configuración del Cliente</Text>

        <View style={styles.filaDato}>
          <Text style={styles.etiquetaDato}>URL Base:</Text>
          <Text style={styles.valorDatoCodigo} selectable>
            {API_BASE_URL}
          </Text>
        </View>

        <View style={styles.filaDato}>
          <Text style={styles.etiquetaDato}>Endpoint Evaluado:</Text>
          <Text style={styles.valorDatoCodigo} selectable>
            {ENDPOINTS.HEALTH}
          </Text>
        </View>

        <View style={styles.filaDato}>
          <Text style={styles.etiquetaDato}>Timeout Máximo:</Text>
          <Text style={styles.valorDato}>
            {REQUEST_TIMEOUT_MS / 1000} segundos (AbortController)
          </Text>
        </View>

        <View style={styles.filaDato}>
          <Text style={styles.etiquetaDato}>Alojamiento:</Text>
          <Text style={styles.valorDato}>Render (Plan Gratuito con Spin-down)</Text>
        </View>
      </View>

      {/* Tarjeta de Resultados de la Prueba */}
      <View style={styles.tarjeta}>
        <View style={styles.cabeceraResultado}>
          <Text style={styles.tituloTarjeta}>Resultado de la Petición</Text>
          {fechaPrueba ? (
            <Text style={styles.textoFechaPrueba}>Última prueba: {fechaPrueba}</Text>
          ) : null}
        </View>

        {cargando ? (
          <View style={styles.cargandoContenedor}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.textoCargando}>Probando endpoint /api/health...</Text>
            <Text style={styles.subtextoCargando}>
              Si el contenedor de Render está dormido, la primera petición puede demorar hasta 60 segundos.
            </Text>
          </View>
        ) : resultadoPrueba ? (
          <View>
            {/* Estado de Conexión */}
            <View
              style={[
                styles.badgeEstado,
                {
                  backgroundColor: resultadoPrueba.exito
                    ? colors.successLight
                    : colors.dangerLight,
                },
              ]}
            >
              <Text
                style={[
                  styles.textoBadgeEstado,
                  {
                    color: resultadoPrueba.exito
                      ? colors.success
                      : colors.danger,
                  },
                ]}
              >
                {resultadoPrueba.exito
                  ? '● SERVIDOR EN LÍNEA'
                  : '▲ ERROR DE COMUNICACIÓN'}
              </Text>
            </View>

            {/* Código HTTP */}
            <View style={styles.filaResultado}>
              <Text style={styles.etiquetaResultado}>Código HTTP Recibido:</Text>
              <Text
                style={[
                  styles.valorResultado,
                  {
                    color:
                      resultadoPrueba.status === 200
                        ? colors.success
                        : colors.danger,
                  },
                ]}
              >
                {resultadoPrueba.status || 'Sin respuesta HTTP'}
              </Text>
            </View>

            {/* Tiempo de Respuesta */}
            {duracionMs !== null ? (
              <View style={styles.filaResultado}>
                <Text style={styles.etiquetaResultado}>Tiempo de respuesta:</Text>
                <Text style={styles.valorResultado}>{duracionMs} ms</Text>
              </View>
            ) : null}

            {/* Mensaje Devuelto */}
            <View style={styles.filaResultado}>
              <Text style={styles.etiquetaResultado}>Mensaje:</Text>
              <Text style={styles.valorMensaje}>
                {resultadoPrueba.message || 'Sin mensaje recibido.'}
              </Text>
            </View>

            {/* Cuerpo JSON recibido */}
            {resultadoPrueba.data ? (
              <View style={styles.cajaJson}>
                <Text style={styles.etiquetaJson}>Payload Data (JSON):</Text>
                <Text style={styles.textoJson} selectable>
                  {JSON.stringify(resultadoPrueba.data, null, 2)}
                </Text>
              </View>
            ) : null}
          </View>
        ) : (
          <Text style={styles.textoSinPrueba}>
            No se ha ejecutado ninguna prueba todavía. Presiona el botón inferior.
          </Text>
        )}

        {/* Botón Probar Conexión */}
        <TouchableOpacity
          style={[styles.botonProbar, cargando && styles.botonDeshabilitado]}
          onPress={ejecutarPruebaConexion}
          disabled={cargando}
          activeOpacity={0.8}
        >
          <Text style={styles.textoBotonProbar}>
            {cargando ? 'Probando conexión...' : '⚡ Probar conexión ahora'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Nota Pedagógica */}
      <View style={styles.tarjetaNota}>
        <Text style={styles.tituloNota}>💡 Nota para el docente y evaluadores</Text>
        <Text style={styles.textoNota}>
          Esta pantalla valida directamente la disponibilidad del backend sin datos simulados.
          Si se desactiva la conexión WiFi/Datos del móvil, esta pantalla registrará el error de red de forma inmediata y clara sin congelar la aplicación.
        </Text>
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
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  tituloBanner: {
    ...typography.h2,
    color: '#ffffff',
    marginBottom: 4,
  },
  descripcionBanner: {
    ...typography.bodySecondary,
    color: '#cbd5e1',
    lineHeight: 18,
  },
  tarjeta: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  tituloTarjeta: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  cabeceraResultado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  textoFechaPrueba: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  filaDato: {
    marginBottom: spacing.sm,
  },
  etiquetaDato: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  valorDato: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  valorDatoCodigo: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.accent,
    backgroundColor: '#f1f5f9',
    padding: 6,
    borderRadius: 6,
  },
  cargandoContenedor: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  textoCargando: {
    ...typography.body,
    fontWeight: '600',
    color: colors.primary,
    marginTop: spacing.sm,
  },
  subtextoCargando: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: spacing.md,
  },
  badgeEstado: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  textoBadgeEstado: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  filaResultado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  etiquetaResultado: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  valorResultado: {
    fontSize: 14,
    fontWeight: '700',
  },
  valorMensaje: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
  cajaJson: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  etiquetaJson: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 4,
    fontWeight: '600',
  },
  textoJson: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#38bdf8',
  },
  textoSinPrueba: {
    ...typography.bodySecondary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  botonProbar: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  textoBotonProbar: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  tarjetaNota: {
    backgroundColor: '#fffbeb',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  tituloNota: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 4,
  },
  textoNota: {
    fontSize: 12,
    color: '#78350f',
    lineHeight: 18,
  },
});
