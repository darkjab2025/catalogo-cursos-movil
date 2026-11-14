import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { colors, spacing, typography, shadows } from '../styles/theme';
import { obtenerCursos } from '../services/catalogoService';
import CursoCard from '../components/CursoCard';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';

/**
 * Pantalla 2: Listado de Cursos
 * Muestra el catálogo mediante FlatList, consumiendo GET /api/cursos
 * Soporta filtrado por categoría si se recibe el parámetro categoriaId.
 */
export default function CursosScreen({ navigation, route }) {
  // Parámetros opcionales si se viene desde la pantalla de categorías
  const categoriaId = route?.params?.categoriaId || null;
  const categoriaNombre = route?.params?.categoriaNombre || null;

  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState(null);

  // Cargar cursos desde la API
  const cargarCursos = useCallback(async () => {
    try {
      setError(null);
      const datosCursos = await obtenerCursos(categoriaId);
      setCursos(datosCursos);
    } catch (err) {
      setError(err.message || 'No fue posible obtener los cursos del servidor.');
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  }, [categoriaId]);

  useEffect(() => {
    setCargando(true);
    cargarCursos();
  }, [cargarCursos]);

  const alRefrescar = () => {
    setRefrescando(true);
    cargarCursos();
  };

  const quitarFiltro = () => {
    navigation.setParams({ categoriaId: null, categoriaNombre: null });
  };

  // Renderizado del estado de carga inicial
  if (cargando) {
    return (
      <LoadingView
        mensaje="Cargando cursos..."
        submensaje="Obteniendo la lista de cursos desde el servidor Laravel en Render."
      />
    );
  }

  // Renderizado del estado de error con opción a reintentar
  if (error) {
    return (
      <ErrorView
        mensaje={error}
        onRetry={() => {
          setCargando(true);
          cargarCursos();
        }}
        textoBoton="Reintentar consulta"
      />
    );
  }

  return (
    <View style={styles.pantalla}>
      {/* Barra de filtro activo (si aplica) */}
      {categoriaId ? (
        <View style={styles.barraFiltro}>
          <View style={styles.infoFiltro}>
            <Text style={styles.etiquetaFiltro}>Filtrado por categoría:</Text>
            <Text style={styles.nombreFiltro}>{categoriaNombre || `ID ${categoriaId}`}</Text>
          </View>
          <TouchableOpacity
            style={styles.botonQuitarFiltro}
            onPress={quitarFiltro}
            activeOpacity={0.7}
          >
            <Text style={styles.textoQuitarFiltro}>Mostrar todos ✕</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Lista de cursos con FlatList */}
      <FlatList
        data={cursos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CursoCard
            curso={item}
            onPress={() => navigation.navigate('DetalleCurso', { id: item.id })}
          />
        )}
        contentContainerStyle={styles.listaContenido}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refrescando}
            onRefresh={alRefrescar}
            colors={[colors.accent]}
            tintColor={colors.accent}
          />
        }
        ListHeaderComponent={
          <View style={styles.cabeceraLista}>
            <Text style={styles.totalCursos}>
              {cursos.length} {cursos.length === 1 ? 'curso disponible' : 'cursos disponibles'}
            </Text>
            <TouchableOpacity onPress={alRefrescar} style={styles.botonActualizar}>
              <Text style={styles.textoBotonActualizar}>Actualizar ⟳</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.contenedorVacio}>
            <Text style={styles.iconoVacio}>📂</Text>
            <Text style={styles.tituloVacio}>No se encontraron cursos</Text>
            <Text style={styles.mensajeVacio}>
              {categoriaId
                ? 'No hay cursos registrados para esta categoría específica.'
                : 'No hay cursos disponibles en el catálogo en este momento.'}
            </Text>
            {categoriaId ? (
              <TouchableOpacity
                style={styles.botonLimpiarFiltro}
                onPress={quitarFiltro}
              >
                <Text style={styles.textoBotonLimpiar}>Ver todos los cursos</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listaContenido: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  barraFiltro: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#bae6fd',
  },
  infoFiltro: {
    flex: 1,
  },
  etiquetaFiltro: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '600',
  },
  nombreFiltro: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  botonQuitarFiltro: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#7dd3fc',
  },
  textoQuitarFiltro: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
  cabeceraLista: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: 2,
  },
  totalCursos: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  botonActualizar: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  textoBotonActualizar: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  contenedorVacio: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: spacing.xl,
    alignItems: 'center',
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  iconoVacio: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  tituloVacio: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  mensajeVacio: {
    ...typography.bodySecondary,
    textAlign: 'center',
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  botonLimpiarFiltro: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  textoBotonLimpiar: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});
