# Arquitectura Técnica - WarmiNet

## 📐 Visión General

WarmiNet es una aplicación React Native construida con Expo, que implementa un sistema de seguridad para mujeres mediante simulaciones locales de servicios cloud.

```
┌─────────────────────────────────────────────────────────┐
│                     WarmiNet App                        │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Presentation │  │   Business   │  │     Data     │ │
│  │    Layer     │──│    Logic     │──│    Layer     │ │
│  │  (Screens)   │  │  (Services)  │  │  (MockData)  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│         │                  │                  │         │
│         └──────────────────┴──────────────────┘         │
│                            │                            │
│                     ┌──────▼──────┐                     │
│                     │  Platform   │                     │
│                     │   APIs      │                     │
│                     └─────────────┘                     │
└─────────────────────────────────────────────────────────┘
```

## 🏗️ Arquitectura por Capas

### 1. Presentation Layer (UI)
**Ubicación**: `src/screens/`

**Responsabilidades**:
- Renderizar interfaces de usuario
- Manejar interacciones del usuario
- Mostrar estados de loading/error
- Navegación entre pantallas

**Tecnologías**:
- React Native components
- StyleSheet API
- React Navigation
- Modal, ScrollView, TouchableOpacity

**Pantallas principales**:
```
src/screens/
├── WelcomeScreen.js          # Landing y entrada
├── CameraIDScreen.js         # Captura y validación CI
├── RegisterFormScreen.js     # Formulario datos
├── FaceVerificationScreen.js # Biometría facial
├── HomeMapScreen.js          # Mapa principal
├── DemoMenuScreen.js         # Menú navegación
├── PuntosRojosScreen.js      # Simulación 1
├── PanicoScreen.js           # Simulación 2
└── TrayectoSeguroScreen.js   # Simulación 3
```

### 2. Business Logic Layer
**Ubicación**: `src/services/`

**Responsabilidades**:
- Lógica de negocio
- Integración con APIs externas
- Procesamiento de datos
- Validaciones complejas

**Servicios**:
```
src/services/
└── awsService.js
    ├── initAWS()                  # Inicialización Amplify
    ├── simulateCognitoLogin()     # Auth simulada
    ├── invokeLambdaDemo()         # Funciones serverless
    └── sendSNSNotification()      # Notificaciones
```

### 3. Data Layer
**Ubicación**: `src/data/`, `src/constants/`

**Responsabilidades**:
- Definición de datos estáticos
- Constantes de configuración
- Mock data para simulaciones

**Archivos**:
```
src/data/
└── mockData.js
    ├── PUNTOS_ROJOS[]          # Zonas peligrosas
    ├── INCIDENTES_PANICO[]     # Casos de emergencia
    ├── RUTAS_SEGURAS[]         # Trayectos predefinidos
    └── USUARIOS_DEMO           # Datos de prueba

src/constants/
└── colors.js
    ├── COLORS                  # Paleta de la app
    └── SUCRE_COORDINATES       # Centro del mapa
```

## 🔄 Flujos de Datos

### Flujo de Autenticación
```
User Input → CameraIDScreen
    ↓
    OCR Simulation (local)
    ↓
    Gender Detection
    ↓
[If Female] → RegisterFormScreen
    ↓
    Form Validation (local)
    ↓
    FaceVerificationScreen
    ↓
    Biometric Scan (simulated)
    ↓
    HomeMapScreen
```

### Flujo de Pánico
```
User Action → PanicoScreen (press & hold 3s)
    ↓
    Timer Validation
    ↓
    Activate Emergency Mode
    ↓
    Parallel Actions:
    ├─→ Record Video/Audio (simulated)
    ├─→ Mark GPS Route
    └─→ Send Notifications
        ├─→ Nearby Women
        ├─→ Trusted Contacts (SNS)
        └─→ Police (after 2 confirmations)
```

### Flujo de Puntos Rojos
```
Map Interaction → PuntosRojosScreen
    ↓
    Long Press on Map
    ↓
    Capture Location
    ↓
    Add Photo + Description
    ↓
    Create Red Point Marker
    ↓
    Store in Local State
    ↓
    Render on Map
    
[Proximity Detection]
    ↓
    Calculate Distance
    ↓
[If < 20m] → Trigger Alert
    ↓
    Vibrate + Sound + Notification
```

## 🗺️ Navegación

### Stack Navigator
```
NavigationContainer
└── Stack.Navigator
    ├── Welcome
    ├── CameraID
    ├── RegisterForm
    ├── FaceVerification
    ├── HomeMap
    ├── DemoMenu
    ├── PuntosRojos
    ├── Panico
    └── TrayectoSeguro
```

### Rutas de navegación:
```javascript
// Flujo completo
Welcome → CameraID → RegisterForm → FaceVerification → HomeMap

// Acceso rápido
Welcome → DemoMenu → [Any Simulation]

// Desde mapa
HomeMap → [PuntosRojos | Panico | TrayectoSeguro]
```

## 🔌 Integraciones

### React Native Maps
```javascript
import MapView, { Marker, Polyline, Circle } from 'react-native-maps';

// Uso en pantallas:
<MapView
  provider={PROVIDER_GOOGLE}
  initialRegion={SUCRE_COORDINATES}
  showsUserLocation={true}
>
  <Marker coordinate={point} pinColor={color} />
  <Polyline coordinates={route} strokeColor={color} />
  <Circle center={point} radius={20} />
</MapView>
```

### Expo Camera
```javascript
import { Camera } from 'expo-camera';

// Verificación facial y CI
const [hasPermission, setHasPermission] = useState(null);
await Camera.requestCameraPermissionsAsync();

<Camera type={Camera.Constants.Type.front} />
```

### Expo Location
```javascript
import * as Location from 'expo-location';

// Obtener ubicación actual
let { status } = await Location.requestForegroundPermissionsAsync();
let location = await Location.getCurrentPositionAsync({});
```

### Expo Haptics
```javascript
import * as Haptics from 'expo-haptics';

// Feedback táctil
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
Vibration.vibrate([0, 500, 200, 500]); // Pattern
```

## 🎨 Sistema de Diseño

### Paleta de Colores (colors.js)
```javascript
export const COLORS = {
  primary: '#4b135f',    // Morado profundo - Acciones principales
  secondary1: '#fd71b2', // Rosa - Alertas positivas
  secondary2: '#840078', // Morado medio - Pánico
  secondary3: '#9c1281', // Púrpura - Trayectos
  neutral: '#b4b4b4',    // Gris - Elementos secundarios
  black: '#000000',      // Texto principal
  white: '#ffffff',      // Fondos claros
  danger: '#ff0000',     // Puntos rojos, emergencias
  warning: '#ff9800',    // Advertencias
  success: '#4caf50',    // Confirmaciones
};
```

### Componentes reutilizables
Si bien no hay una carpeta de componentes separados, los patrones se repiten:

**Botones estándar:**
```javascript
<TouchableOpacity style={styles.button}>
  <Text style={styles.buttonText}>Action</Text>
</TouchableOpacity>
```

**Headers personalizados:**
```javascript
<View style={styles.header}>
  <TouchableOpacity onPress={goBack}>
    <Text>← Volver</Text>
  </TouchableOpacity>
  <Text style={styles.headerTitle}>Title</Text>
</View>
```

**Modals informativos:**
```javascript
<Modal transparent={true} visible={visible}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      {/* Content */}
    </View>
  </View>
</Modal>
```

## 🔐 Manejo de Estado

### Estado Local (useState)
Cada pantalla maneja su propio estado:

```javascript
// Ejemplo en PanicoScreen
const [panicoActivado, setPanicoActivado] = useState(false);
const [tiempoPresion, setTiempoPresion] = useState(0);
const [confirmaciones, setConfirmaciones] = useState(0);

// Actualización de estado
const activarPanico = () => {
  setPanicoActivado(true);
  setTiempoPresion(0);
};
```

### Efectos Secundarios (useEffect)
```javascript
useEffect(() => {
  if (presionando) {
    timerRef.current = setInterval(() => {
      setTiempoPresion(prev => prev + 0.1);
    }, 100);
  }
  return () => clearInterval(timerRef.current);
}, [presionando]);
```

### Referencias (useRef)
```javascript
const timerRef = useRef(null);
// Mantiene referencia mutable sin causar re-renders
```

## ⚡ Optimizaciones

### Lazy Loading
Las pantallas se cargan bajo demanda mediante React Navigation.

### Memoización potencial
Para producción, considerar:
- `React.memo()` para componentes que no cambian frecuentemente
- `useMemo()` para cálculos costosos
- `useCallback()` para callbacks en props

### Manejo de imágenes
```javascript
// Usar require para assets locales (bundle en compilación)
require('../../assets/puntos_rojos/rojo1.jpg')

// Para producción: usar Image caching
import { Image } from 'expo-image';
```

## 🧪 Testing (Recomendado para producción)

### Estructura sugerida:
```
__tests__/
├── screens/
│   ├── WelcomeScreen.test.js
│   └── ...
├── services/
│   └── awsService.test.js
└── utils/
    └── validation.test.js
```

### Herramientas:
- **Jest**: Testing framework
- **React Native Testing Library**: Component testing
- **Detox**: E2E testing

## 📦 Build Process

### Development
```bash
expo start
```
Inicia Metro Bundler, sirve la app a Expo Go.

### Production (EAS)
```bash
eas build --platform android
```
1. Sube código a servidores de Expo
2. Compila en entorno cloud
3. Genera APK/AAB descargable

### Local Build (alternativa)
```bash
expo eject
cd android && ./gradlew assembleRelease
```
Genera APK localmente (requiere Android Studio y configuración).

## 🔮 Escalabilidad

### Para escalar a producción real:

#### 1. State Management Global
Implementar Redux o Context API:
```
src/
├── context/
│   ├── AuthContext.js
│   ├── LocationContext.js
│   └── AlertContext.js
└── redux/
    ├── store.js
    ├── slices/
    │   ├── authSlice.js
    │   └── mapSlice.js
    └── actions/
```

#### 2. Servicios Backend Reales
```
src/services/
├── authService.js      # Cognito real
├── mapService.js       # API de ubicaciones
├── alertService.js     # SNS/FCM real
└── storageService.js   # AsyncStorage/SecureStore
```

#### 3. Persistencia de Datos
```javascript
// AsyncStorage para datos no sensibles
import AsyncStorage from '@react-native-async-storage/async-storage';

// SecureStore para datos sensibles
import * as SecureStore from 'expo-secure-store';

// SQLite para datos estructurados offline
import * as SQLite from 'expo-sqlite';
```

#### 4. API Client
```javascript
// src/api/client.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});
```

## 📊 Métricas y Monitoreo

Para producción, integrar:
- **Sentry**: Error tracking
- **Firebase Analytics**: User behavior
- **AWS CloudWatch**: Backend monitoring
- **Crashlytics**: Crash reporting

## 🔒 Seguridad

### Implementado:
- Validación de entrada en formularios
- Permisos granulares de sistema
- Datos almacenados localmente (no exposición en red)

### Para producción:
- Encriptación de datos sensibles
- Cert pinning para API calls
- Obfuscación de código
- Secure storage para tokens
- Rate limiting en backend

---

**Arquitectura diseñada para**: Demostración funcional con capacidad de escalamiento a producción completa.
