import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors } from './src/styles/theme';
import InicioScreen from './src/screens/InicioScreen';
import CursosScreen from './src/screens/CursosScreen';
import DetalleCursoScreen from './src/screens/DetalleCursoScreen';
import CategoriasScreen from './src/screens/CategoriasScreen';
import EstadoApiScreen from './src/screens/EstadoApiScreen';

const Stack = createNativeStackNavigator();

/**
 * Componente principal de la aplicación móvil
 * Configura el contenedor de navegación y el Native Stack Navigator con las 5 pantallas requeridas.
 */
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={colors.primary} />
      <Stack.Navigator
        initialRouteName="Inicio"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="Inicio"
          component={InicioScreen}
          options={{
            title: 'Catálogo Académico',
          }}
        />

        <Stack.Screen
          name="Cursos"
          component={CursosScreen}
          options={{
            title: 'Listado de Cursos',
          }}
        />

        <Stack.Screen
          name="DetalleCurso"
          component={DetalleCursoScreen}
          options={{
            title: 'Detalle del Curso',
          }}
        />

        <Stack.Screen
          name="Categorias"
          component={CategoriasScreen}
          options={{
            title: 'Categorías Académicas',
          }}
        />

        <Stack.Screen
          name="EstadoApi"
          component={EstadoApiScreen}
          options={{
            title: 'Diagnóstico de la API',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
