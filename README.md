# Catálogo Académico — Aplicación Móvil en React Native y Expo

Aplicación móvil desarrollada como modelo de referencia para el examen final de la asignatura **Desarrollo de Apps Multidispositivo I**.

La aplicación consume en tiempo real una API REST desarrollada en **Laravel 12**, conectada a **PostgreSQL (Neon)** y desplegada en **Render**.

---

## 1. Características Principales

- **Pila 100% JavaScript y JSX**: Sin TypeScript, sin Expo Router y sin librerías externas complejas, facilitando el aprendizaje universitario.
- **Navegación nativa**: Implementada mediante `@react-navigation/native` y `@react-navigation/native-stack` con 5 pantallas funcionales.
- **Consumo REST nativo**: Uso exclusivo de `fetch()` con `async/await` y `AbortController`.
- **Diseño académico y responsivo**: Basado en `StyleSheet`, paleta de colores institucional, tarjetas con sombra y badges de nivel.
- **Tolerancia a latencia de Render**: Manejo con timeout de 120 segundos y avisos informativos durante el arranque en frío (*cold start*).
- **Diagnóstico en vivo**: Pantalla técnica dedicada para que el docente audite la conexión HTTP y el endpoint `/api/health`.

---

## 2. Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de contar con:

1. **Node.js** (versión LTS 18, 20 o 22 recomendada).
2. **npm** (incluido con Node.js).
3. **Dispositivo móvil Android** con la aplicación **Expo Go** instalada desde Google Play Store (o un emulador Android).
4. Conexión a Internet activa (ambos dispositivos deben estar conectados a la misma red WiFi si se usa Expo Go en modo LAN, o usar el modo `--tunnel`).

---

## 3. Dependencias del Proyecto

El proyecto fue creado con la plantilla oficial `blank` de Expo (SDK 58) e incorpora únicamente las dependencias necesarias:

```json
{
  "dependencies": {
    "expo": "~58.0.25",
    "expo-status-bar": "~58.0.5",
    "react": "19.3.0",
    "react-native": "0.88.1",
    "@react-navigation/native": "^7.5.1",
    "@react-navigation/native-stack": "^7.21.0",
    "react-native-screens": "~4.30.1",
    "react-native-safe-area-context": "~5.11.1"
  }
}
```

---

## 4. Estructura del Código Fuente

```text
catalogo-cursos-movil/
├── App.js                     # Configuración de NavigationContainer y Stack Navigator
├── app.json                   # Metadatos del proyecto Expo (nombre visible, orientación)
├── package.json               # Dependencias y scripts de ejecución
├── README.md                  # Este manual paso a paso
└── src/
    ├── config/
    │   └── api.js             # URL base centralizada y endpoints
    ├── services/
    │   └── catalogoService.js # Peticiones HTTP fetch, try/catch y AbortController
    ├── styles/
    │   └── theme.js           # Colores temáticos, espaciados, tipografías y sombras
    ├── components/
    │   ├── CursoCard.js       # Tarjeta de curso con badges de nivel y categoría
    │   ├── LoadingView.js     # Indicador de carga con ActivityIndicator
    │   └── ErrorView.js       # Mensaje visual de error con botón de reintento
    └── screens/
        ├── InicioScreen.js        # Pantalla 1: Bienvenida, métricas y estado en vivo
        ├── CursosScreen.js        # Pantalla 2: FlatList de cursos con pull-to-refresh
        ├── DetalleCursoScreen.js  # Pantalla 3: Detalle por ID (GET /api/cursos/{id})
        ├── CategoriasScreen.js    # Pantalla 4: Filtrado dinámico por categoría
        └── EstadoApiScreen.js     # Pantalla 5: Panel de diagnóstico para docentes
```

---

## 5. Puesta en Marcha en Windows

Abre una terminal de PowerShell o CMD en la carpeta raíz del proyecto (`catalogo-cursos-movil`):

### 1. Instalar dependencias (si clonas el repositorio en otro equipo)
```bash
npm install
```

### 2. Iniciar el servidor de desarrollo de Expo
```bash
npx expo start
```

O para iniciar limpiando la caché de Metro Bundler:
```bash
npx expo start -c
```

### 3. Abrir la aplicación en un teléfono Android (Expo Go)
1. Abre la aplicación **Expo Go** en tu celular Android.
2. Pulsa en **"Scan QR code"**.
3. Escanea el código QR que aparece en la terminal de tu computadora o en la consola del navegador.
4. Espera a que Metro Bundler compile el paquete de JavaScript (100%).

> **Consejo si la red universitaria o de casa bloquea conexiones locales:**
> Si tu computadora y teléfono están en redes distintas o el router bloquea la conexión directa, inicia Expo con el parámetro tunnel:
> ```bash
> npx expo start --tunnel
> ```

---

## 6. Endpoints de la API Consumidos

La URL base está alojada en:
```text
https://api-examen-final-ofvn.onrender.com/api
```

| Pantalla | Endpoint | Método | Función |
| :--- | :--- | :--- | :--- |
| **Inicio / Estado API** | `/health` | `GET` | Comprueba estado del servidor (`{"status":"ok"}`) |
| **Categorías** | `/categorias` | `GET` | Lista las 5 áreas de conocimiento |
| **Cursos** | `/cursos` | `GET` | Lista los 20 cursos disponibles |
| **Detalle Curso** | `/cursos/{id}` | `GET` | Detalle específico de un curso |
| **Filtrar por Categoría** | `/cursos?categoria_id={id}` | `GET` | Retorna los cursos vinculados a la categoría |

---

## 7. Cómo Cambiar la URL de la API

Si deseas probar la aplicación contra otro backend o una instancia local:

1. Abre el archivo:
   ```text
   src/config/api.js
   ```
2. Modifica la constante `API_BASE_URL`:
   ```javascript
   export const API_BASE_URL = 'https://tu-nueva-api.com/api';
   ```
3. Guarda el archivo. Expo recargará la aplicación automáticamente mediante Fast Refresh.

---

## 8. Diagnóstico de la Conexión (Para Docentes)

Para validar que la aplicación se comunica de forma real con Render y no utiliza datos simulados:
1. En la pantalla de **Inicio**, pulsa el botón **"Diagnóstico de la API"**.
2. Presiona **"⚡ Probar conexión ahora"**.
3. Observarás:
   - La URL base evaluada.
   - El código HTTP real devuelto por Render (`200 OK`).
   - El tiempo de respuesta en milisegundos (`ms`).
   - El payload JSON exacto devuelto por Laravel.
4. **Prueba de fallo de red**: Si desactivas temporalmente el WiFi de tu celular y pulsas el botón, la aplicación mostrará inmediatamente la alerta de error de red sin bloquearse ni cerrarse.

---

## 9. Preguntas Frecuentes y Solución de Problemas

### 1. La primera consulta tarda mucho o se muestra "Conectando con el servidor..."
- **Causa**: La API está desplegada en el plan gratuito de Render. Tras 15 minutos sin peticiones, el servidor entra en reposo (*spin down*).
- **Solución**: La aplicación tiene un timeout de 120 segundos configurado con `AbortController`. Espera unos 30-50 segundos mientras el contenedor despierta. Las consultas posteriores responderán en menos de 500 ms.

### 2. Error "Network request failed" en Expo Go
- **Causa**: El celular no tiene acceso a internet o tu red WiFi corporativa bloquea el puerto de Metro.
- **Solución**: Verifica el acceso a internet en el celular o inicia el proyecto con `npx expo start --tunnel`.

### 3. Error de políticas de script en PowerShell en Windows (`npx : No se puede cargar el archivo...`)
- **Solución**: Utiliza `npx.cmd expo start` en lugar de `npx expo start`, o ejecuta `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` en tu sesión de PowerShell.
