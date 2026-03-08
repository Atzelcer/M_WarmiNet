# WarmiNet 🛡️

**Red de seguridad exclusiva para mujeres**

WarmiNet es una aplicación móvil de seguridad para mujeres que combina tecnología de mapas colaborativos, alertas de emergencia y monitoreo de trayectos seguros. Diseñada exclusivamente para mujeres verificadas mediante reconocimiento de identidad.

## 🎯 Características principales

### 1️⃣ Puntos Rojos Colaborativos
- Reportar zonas peligrosas con foto y descripción
- Alertas automáticas al acercarse a puntos rojos
- Sistema de confirmación comunitario ("gracias")

### 2️⃣ Botón de Pánico 3 Segundos
- Activación rápida manteniendo presionado 3 segundos
- Grabación automática de video y audio (30s)
- Marcado de ruta con puntos negros en tiempo real
- Notificación a mujeres cercanas
- Llamada automática a policía tras 2 confirmaciones
- Alerta a personas de confianza

### 3️⃣ Trayecto Seguro
- Definir ruta con inicio, destino y tiempo estimado
- Monitoreo automático del trayecto
- Opción de extender tiempo si es necesario
- Alerta automática a familia si no hay confirmación de llegada

### 🔐 Verificación exclusiva mujeres
- Validación de identidad mediante CI (OCR simulado)
- Verificación facial biométrica
- Acceso restringido solo para mujeres

## 🎨 Paleta de colores

- **Primario**: `#4b135f` (morado profundo)
- **Secundarios**: `#fd71b2`, `#840078`, `#9c1281`
- **Neutros**: `#b4b4b4`, `#000000`

## 🛠️ Stack tecnológico

- **Framework**: React Native + Expo
- **Navegación**: React Navigation
- **Mapas**: react-native-maps (Google Maps)
- **Cámara**: expo-camera
- **Ubicación**: expo-location
- **Backend simulado**: AWS (Amplify, Cognito, Lambda, SNS)
- **Datos**: Hardcodeados localmente (sin BD real)

## 📂 Estructura del proyecto

```
M_WarmiNet/
├── App.js                      # Punto de entrada principal
├── app.json                    # Configuración Expo
├── package.json                # Dependencias
├── eas.json                    # Configuración EAS Build
├── assets/                     # Recursos multimedia
│   ├── logo/                   # Logo y iconos
│   ├── carnets/                # Imágenes CI para OCR
│   ├── puntos_rojos/           # Fotos de zonas peligrosas
│   └── panico/                 # Videos y audios de incidentes
├── src/
│   ├── constants/
│   │   └── colors.js           # Paleta de colores
│   ├── data/
│   │   └── mockData.js         # Datos simulados
│   ├── services/
│   │   └── awsService.js       # Integración AWS simulada
│   └── screens/                # Pantallas de la app
│       ├── WelcomeScreen.js
│       ├── CameraIDScreen.js
│       ├── RegisterFormScreen.js
│       ├── FaceVerificationScreen.js
│       ├── HomeMapScreen.js
│       ├── DemoMenuScreen.js
│       ├── PuntosRojosScreen.js
│       ├── PanicoScreen.js
│       └── TrayectoSeguroScreen.js
└── docs/                       # Documentación
    ├── BUILD_GUIDE.md          # Guía de compilación
    └── AWS_SETUP.md            # Configuración AWS
```

## 🚀 Instalación y uso

### Prerrequisitos
- Node.js v16+
- npm o yarn
- Expo CLI: `npm install -g expo-cli`

### Instalación
```bash
# Clonar o descargar el proyecto
cd M_WarmiNet

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm start
```

### Ejecutar en dispositivo
1. Instalar **Expo Go** desde Play Store
2. Escanear el QR que aparece en terminal
3. La app se cargará en tu teléfono

### Compilar APK
Ver guía completa en: [`docs/BUILD_GUIDE.md`](docs/BUILD_GUIDE.md)

Resumen rápido:
```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login en Expo
eas login

# Compilar APK
eas build --platform android --profile preview
```

## 🎮 Demo y navegación

La app incluye un **menú de demos** para acceso rápido a todas las funcionalidades sin pasar por el registro completo.

### Flujo completo de registro:
1. Pantalla de bienvenida
2. Verificación de CI con OCR
3. Formulario de datos y personas de confianza
4. Verificación facial
5. Acceso al mapa principal

### Acceso rápido a demos:
Desde la pantalla de bienvenida → botón "Ir directo a DEMOS"

## 📱 Pantallas implementadas

| Pantalla | Descripción |
|----------|-------------|
| **Welcome** | Presentación de la app y opciones de entrada |
| **CameraID** | Captura y validación de CI con OCR simulado |
| **RegisterForm** | Formulario de datos personales y contactos de confianza |
| **FaceVerification** | Escaneo y verificación de rostro |
| **HomeMap** | Mapa principal con puntos rojos y botones de acción |
| **DemoMenu** | Menú de acceso rápido a simulaciones |
| **PuntosRojos** | 3 escenarios de puntos peligrosos colaborativos |
| **Panico** | 3 incidentes simulados con botón de pánico |
| **TrayectoSeguro** | 3 rutas con monitoreo de tiempo |

## ☁️ Integración AWS (Simulada)

La app incluye configuración básica de:
- **Cognito**: Autenticación de usuarios
- **Lambda**: Funciones serverless
- **SNS**: Notificaciones push

Ver configuración completa en: [`docs/AWS_SETUP.md`](docs/AWS_SETUP.md)

## 🎯 Casos de uso demostrados

### Escenario 1: Reportar zona peligrosa
1. Usuario toca "Puntos Rojos"
2. Selecciona "Crear punto"
3. Mantiene presionado en el mapa para ubicación
4. Agrega foto y descripción
5. Punto rojo aparece en el mapa

### Escenario 2: Alerta de acercamiento
1. Usuario se acerca a menos de 20m de punto rojo
2. El teléfono vibra y suena
3. Aparece notificación con descripción y foto
4. Usuario puede agradecer el reporte

### Escenario 3: Botón de pánico
1. Usuario mantiene presionado botón 3 segundos
2. Se activa grabación de video/audio
3. Se marcan puntos negros en ruta
4. 2 mujeres confirman ayuda
5. Se llama automáticamente a policía
6. Se notifica a familia

### Escenario 4: Trayecto seguro
1. Usuario define ruta (ej: Casa → USFX)
2. Establece tiempo estimado (30 min)
3. Inicia trayecto
4. Al vencer tiempo, aparece opción de extender
5. Si no responde, se alerta a familia con ubicación

## 📝 Notas importantes

### Simulaciones vs Producción
- **OCR**: Detecta basándose en nombre de archivo (contiene "mujer" o "hombre")
- **Datos**: Todo hardcodeado en archivos locales
- **AWS**: Configurado pero no conectado a servicios reales
- **Notificaciones**: Simuladas con logs en consola

### Assets pendientes
Debes proporcionar tus propias imágenes en:
- Logo de WarmiNet
- Fotos de ejemplo de CI
- Fotos de zonas peligrosas
- Videos y audios de incidentes

Ver `assets/README_ASSETS.md` para especificaciones.

## 🔧 Personalización

### Cambiar coordenadas (otra ciudad)
Edita `src/constants/colors.js`:
```javascript
export const SUCRE_COORDINATES = {
  latitude: -19.046,  // Tu latitud
  longitude: -65.259,  // Tu longitud
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};
```

### Modificar datos de demo
Edita `src/data/mockData.js` para cambiar:
- Puntos rojos predefinidos
- Incidentes de pánico
- Rutas seguras
- Datos de usuario demo

## 🐛 Troubleshooting

### Mapa en blanco
- Configura tu Google Maps API key en `app.json`
- Habilita "Maps SDK for Android" en Google Cloud Console

### Cámara no funciona
- Verifica permisos en `app.json`
- Acepta permisos manualmente en el dispositivo

### OCR no detecta género
- Verifica que las imágenes de CI contengan "mujer" o "hombre" en el nombre del archivo

## 📄 Licencia

Este proyecto es una demostración académica para WarmiNet.

## 👥 Contacto

Para soporte o consultas sobre el proyecto, contactar al equipo de desarrollo de WarmiNet.

---

**Desarrollado con ❤️ para la seguridad de las mujeres en Bolivia**
