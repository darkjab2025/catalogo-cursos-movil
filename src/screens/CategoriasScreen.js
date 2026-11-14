import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { colors, spacing, typography, shadows } from '../styles/theme';
import { obtenerCategorias, obtenerCursos } from '../services/catalogoService';
import CursoCard from '../components/CursoCard';
import LoadingView from '../components/LoadingView';
import ErrorView from '../components/ErrorView';

/**
 * Pantalla 4: Categorías
 * Muestra el listado de categorías mediante FlatList (GET /api/categorias).
 * Al seleccionar una categoría, consulta y filtra cursos con GET /api/cursos?categoria_id={id}.
 * Ofrece la opción de volver a mostrar todos los cursos.
 */
export default function CategoriasScreen({ navigation }) {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [cursosFiltrados, setCursosFiltrados] = useState([]);
  
  const [cargandoCategorias, setCargandoCategorias] = useState(true);
  const [cargandoCursos, setCargandoCursos] = useState(false);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState(null);

  // Carga inicial de categorías
  const cargarCategorias = async () => {
    try {
      setError(null);
      const datos = await obtenerCategorias();
      setCategorias(datos);
    } catch (err) {
      setError(err.message || 'No se pudieron obtener las categorías.');
    } finally {
      setCargandoCategorias(false);
      setRefrescando(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  // Al seleccionar una categoría, se consultan los cursos correspondientes
  const seleccionarCategoria = async (cat) => {
    // Si presiona la misma, deselecciona para volver a mostrar todo
    if (categoriaSeleccionada?.id === cat.id) {
      limpiarSeleccion();
      return;
    }

    try {
      setCategoriaSeleccionada(cat);
      setCargandoCursos(true);
      const cursos = await obtenerCursos(cat.id);
      setCursosFiltrados(cursos);
    } catch (err) {
      setError(err.message || 'Error al filtrar los cursos por categoría.');
    } finally {
      setCargandoCursos(false);
    }
  };

  // Limpiar filtro y restablecer
  const limpiarSeleccion = () => {
    setCategoriaSeleccionada(null);
    setCursosFiltrados([]);
  };

  const alRefrescar = () => {
    setRefrescando(true);
    cargarCategorias();
    if (categoriaSeleccionada) {
      seleccionarCategoria(categoriaSeleccionada);
    }
  };

  if (cargandoCategorias) {
    return (
      <LoadingView
        mensaje="Cargando categorías..."
        submensaje="Obteniendo las áreas temáticas desde la API de Laravel."
      />
    );
  }

  if (error && categorias.length === 0) {
    return (
      <ErrorView
        mensaje={error}
        onRetry={() => {
          setCargandoCategorias(true);
          cargarCategorias();
        }}
        textoBoton="Reintentar"
      />
    );
  }

  return (
    <View style={styles.pantalla}>
      <FlatList
        data={categoriaSeleccionada ? cursosFiltrados : []}
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
          <View>
            {/* Introducción de la pantalla */}
            <View style={styles.bannerInfo}>
              <Text style={styles.tituloSeccion}>Áreas del Conocimiento</Text>
              <Text style={styles.descripcionSeccion}>
                Selecciona una categoría para consultar en tiempo real los cursos pertenecientes a ella mediante el parámetro <Text style={styles.codigoTexto}>?categoria_id</Text>.
              </Text>
            </View>

            {/* Listado horizontal/vertical de categorías */}
            <View style={styles.contenedorCategorias}>
              {categorias.map((cat) => {
                const estaSeleccionada = categoriaSeleccionada?.id === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id.toString()}
                    style={[
                      styles.tarjetaCategoria,
                      estaSeleccionada && styles.tarjetaCategoriaActiva,
                    ]}
                    onPress={() => seleccionarCategoria(cat)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.cabeceraCategoria}>
                      <View style={styles.filaNombreCategoria}>
                        <Text style={styles.iconoCategoria}>
                          {estaSeleccionada ? '📌' : '📁'}
                        </Text>
                        <Text
                          style={[
                            styles.nombreCategoria,
                            estaSeleccionada && styles.nombreCategoriaActiva,
                          ]}
                        >
                          {cat.nombre}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.chipEstado,
                          estaSeleccionada && styles.chipEstadoActivo,
                        ]}
                      >
                        <Text
                          style={[
                            styles.textoChip,
                            estaSeleccionada && styles.textoChipActivo,
                          ]}
                        >
                          {estaSeleccionada ? 'Activa' : 'Filtrar'}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.descripcionCategoria,
                        estaSeleccionada && styles.descripcionCategoriaActiva,
                      ]}
                    >
                      {cat.descripcion}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Panel de resultados filtrados */}
            {categoriaSeleccionada ? (
              <View style={styles.panelFiltro}>
                <View style={styles.cabeceraFiltro}>
                  <View style={styles.textosFiltro}>
                    <Text style={styles.etiquetaCursosFiltrados}>CURSOS ENCONTRADOS</Text>
                    <Text style={styles.tituloFiltroActivo}>
                      {categoriaSeleccionada.nombre} ({cursosFiltrados.length})
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.botonVolverTodos}
                    onPress={limpiarSeleccion}
                  >
                    <Text style={styles.textoBotonVolverTodos}>Mostrar todos los cursos ✕</Text>
                  </TouchableOpacity>
                </View>

                {cargandoCursos ? (
                  <View style={styles.cargandoFiltro}>
                    <ActivityIndicator size="small" color={colors.accent} />
                    <Text style={styles.textoCargandoFiltro}>
                      Consultando /api/cursos?categoria_id={categoriaSeleccionada.id}...
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : (
              <View style={styles.panelTodosCursos}>
                <Text style={styles.textoInfoTodos}>
                  👆 Toca una categoría para ver sus cursos, o pulsa abajo para ver el catálogo general completo:
                </Text>
                <TouchableOpacity
                  style={styles.botonCatalogoCompleto}
                  onPress={() => navigation.navigate('Cursos')}
                >
                  <Text style={styles.textoBotonCatalogoCompleto}>
                    Ir al Catálogo Completo de Cursos →
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          categoriaSeleccionada && !cargandoCursos ? (
            <View style={styles.contenedorVacio}>
              <Text style={styles.iconoVacio}>🔍</Text>
              <Text style={styles.tituloVacio}>Sin cursos en esta categoría</Text>
              <Text style={styles.mensajeVacio}>
                No se devolvieron registros para {categoriaSeleccionada.nombre}.
              </Text>
            </View>
          ) : null
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
  bannerInfo: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  tituloSeccion: {
    ...typography.h2,
    color: colors.primary,
    marginBottom: 4,
  },
  descripcionSeccion: {
    ...typography.bodySecondary,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  codigoTexto: {
    fontFamily: 'monospace',
    fontWeight: '700',
    color: colors.accent,
  },
  contenedorCategorias: {
    marginBottom: spacing.md,
  },
  tarjetaCategoria: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadows.card,
  },
  tarjetaCategoriaActiva: {
    borderColor: colors.accent,
    backgroundColor: '#f0f9ff',
  },
  cabeceraCategoria: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  filaNombreCategoria: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconoCategoria: {
    fontSize: 16,
    marginRight: 8,
  },
  nombreCategoria: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  nombreCategoriaActiva: {
    color: colors.accent,
  },
  chipEstado: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
  },
  chipEstadoActivo: {
    backgroundColor: colors.accent,
  },
  textoChip: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  textoChipActivo: {
    color: '#ffffff',
  },
  descripcionCategoria: {
    ...typography.bodySecondary,
    color: colors.textSecondary,
    marginTop: 2,
  },
  descripcionCategoriaActiva: {
    color: colors.primary,
  },
  panelFiltro: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  cabeceraFiltro: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#bae6fd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    ...shadows.card,
  },
  textosFiltro: {
    flex: 1,
  },
  etiquetaCursosFiltrados: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
    letterSpacing: 0.8,
  },
  tituloFiltroActivo: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  botonVolverTodos: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  textoBotonVolverTodos: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
  cargandoFiltro: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  textoCargandoFiltro: {
    ...typography.caption,
    marginLeft: 8,
    color: colors.textSecondary,
  },
  panelTodosCursos: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  textoInfoTodos: {
    ...typography.bodySecondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  botonCatalogoCompleto: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  textoBotonCatalogoCompleto: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  contenedorVacio: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconoVacio: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  tituloVacio: {
    ...typography.h3,
    color: colors.primary,
    marginBottom: 2,
  },
  mensajeVacio: {
    ...typography.bodySecondary,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
