# WarmiNet - Guía de Instalación y Compilación

## Requisitos previos

### Software necesario:
1. **Node.js** (v16 o superior)
   - Descargar de: https://nodejs.org/
   
2. **Expo CLI**
   ```bash
   npm install -g expo-cli
   ```

3. **Android Studio** (para compilar APK)
   - Descargar de: https://developer.android.com/studio
   - Instalar Android SDK y herramientas de compilación

4. **Java Development Kit (JDK 11)**
   - Necesario para compilación Android

## Instalación del proyecto

### 1. Instalar dependencias
```bash
cd M_WarmiNet
npm install
```

### 2. Preparar assets
Coloca las imágenes y videos en las carpetas correspondientes:
- `assets/logo/` - Logo de WarmiNet
- `assets/carnets/` - Imágenes de CI
- `assets/puntos_rojos/` - Fotos de zonas peligrosas
- `assets/panico/` - Videos y audios de incidentes

Ver `assets/README_ASSETS.md` para detalles.

### 3. Configurar Google Maps (opcional pero recomendado)
Edita `app.json` y reemplaza `YOUR_GOOGLE_MAPS_API_KEY` con tu API key de Google Maps:
```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "TU_API_KEY_AQUI"
    }
  }
}
```

Obtener API key: https://developers.google.com/maps/documentation/android-sdk/get-api-key

## Ejecutar en desarrollo

### Modo desarrollo con Expo Go:
```bash
npm start
```
Escanea el QR con la app Expo Go en tu teléfono Android.

### Modo desarrollo en emulador Android:
```bash
npm run android
```

## Compilar APK para producción

### Opción 1: EAS Build (Recomendado - más fácil)

1. **Instalar EAS CLI:**
```bash
npm install -g eas-cli
```

2. **Inicializar EAS:**
```bash
eas login
eas build:configure
```

3. **Compilar APK:**
```bash
eas build --platform android --profile preview
```

El APK se descargará automáticamente cuando esté listo (~10-15 minutos).

### Opción 2: Build local (Requiere configuración completa)

1. **Configurar variables de entorno:**
```bash
# Windows (PowerShell)
$env:ANDROID_HOME = "C:\Users\TU_USUARIO\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\platform-tools"
```

2. **Ejectar Expo sin modo managed:**
```bash
expo eject
```

3. **Compilar con Gradle:**
```bash
cd android
./gradlew assembleRelease
```

El APK estará en: `android/app/build/outputs/apk/release/app-release.apk`

### Opción 3: APK de desarrollo (más rápido para pruebas)

```bash
eas build --platform android --profile development --local
```

## Instalación del APK en dispositivo

1. Transfiere el APK a tu teléfono Android
2. Habilita "Instalar apps de fuentes desconocidas" en configuración
3. Abre el archivo APK e instala

## Permisos necesarios

La app solicitará estos permisos en tiempo de ejecución:
- 📷 **Cámara**: Para verificación de CI y rostro
- 📍 **Ubicación**: Para mapas y funciones de seguridad
- 🎤 **Micrófono**: Para grabación de audio en pánico
- 📁 **Almacenamiento**: Para acceder a galería de fotos

## Configuración EAS Build (eas.json)

Si usas EAS Build, el archivo `eas.json` ya está configurado:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

## Troubleshooting

### Error: "Google Maps no funciona"
- Asegúrate de tener una API key válida de Google Maps
- Verifica que la API key tenga habilitado "Maps SDK for Android"

### Error: "Expo Go no puede cargar la app"
- Verifica que el teléfono y PC estén en la misma red WiFi
- Usa túnel: `expo start --tunnel`

### Error en compilación: "SDK not found"
- Verifica que Android Studio esté instalado completamente
- Configura correctamente ANDROID_HOME

### App se cierra al abrir cámara
- Verifica que los permisos estén correctamente configurados en `app.json`
- En dispositivo físico, acepta los permisos manualmente

## Estructura de archivos compilados

```
android/
  app/
    build/
      outputs/
        apk/
          release/
            app-release.apk  ← Tu APK final
```

## Siguiente paso: Distribución

Para distribución pública, considera:
- **Google Play Store**: Requiere app bundle (AAB) y cuenta de desarrollador ($25 USD único)
- **Distribución directa**: Comparte el APK directamente

## Soporte

Para más información sobre Expo Build:
- Documentación Expo: https://docs.expo.dev/build/introduction/
- EAS Build: https://docs.expo.dev/build/setup/

Para configuración de AWS:
- Ver `docs/AWS_SETUP.md`
