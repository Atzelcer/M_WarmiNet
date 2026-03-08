# 📱 INSTRUCCIONES DE USO - WARMINET

## ⚠️ IMPORTANTE: Web desactivado temporalmente

**Problema detectado:** Incompatibilidad entre `react-native-web 0.19.6` y `React Native 0.73.6`  
**Error:** "Unable to resolve ../Utilities/Platform"  
**Solución aplicada:** Web desactivado, app funciona perfectamente en **Expo Go móvil**

---

## ✅ CÓMO USAR LA APP (Recomendado)

### **Opción 1: Expo Go en Android (MEJOR OPCIÓN)** 📱

1. **Instala Expo Go en tu Android:**
   - Abre Google Play Store
   - Busca "Expo Go"
   - Instala la app

2. **Inicia el servidor:**
   ```bash
   npx expo start
   ```

3. **Escanea el código QR:**
   - Abre Expo Go en tu teléfono
   - Toca "Scan QR code"
   - Escanea el QR que aparece en la terminal
   - ¡La app se abrirá en tu teléfono!

4. **Funcionalidades disponibles:**
   - ✅ Cámara para ID y verificación facial
   - ✅ GPS y mapas (Google Maps)
   - ✅ Botón de pánico con vibración
   - ✅ Rutas seguras
   - ✅ Puntos rojos (zonas peligrosas)
   - ✅ Todas las 9 pantallas funcionando

---

### **Opción 2: Conectar tu teléfono por USB**

1. **Habilita depuración USB en tu Android:**
   - Settings → About phone → Toca "Build number" 7 veces
   - Settings → Developer options → Enable "USB debugging"

2. **Conecta tu teléfono a la PC con cable USB**

3. **Ejecuta:**
   ```bash
   npx expo start
   ```

4. **Presiona `a` en la terminal** para instalar en tu dispositivo conectado

---

### **Opción 3: Compilar APK para instalar** 📦

**Para crear el APK final:**

```bash
# 1. Configurar EAS Build
npx eas-cli login
npx eas build:configure

# 2. Compilar APK
eas build --platform android --profile preview

# 3. Descargar APK del link que te proporciona
# 4. Instalar en tu teléfono
```

---

## ❌ POR QUÉ NO FUNCIONA WEB

**Diagnóstico técnico:**

```
Error: Unable to resolve "../Utilities/Platform"
From: node_modules\react-native\Libraries\ReactPrivate\ReactNativePrivateInterface.js
```

**Causa raíz:**
- React Native 0.73.6 reorganizó módulos internos
- react-native-web 0.19.6 no es compatible con esta estructura
- Necesita actualizar a react-native-web 0.19.10+ o React Native 0.74+

**Soluciones posibles (para futuro):**

1. **Actualizar a Expo SDK 51:**
   ```bash
   npx expo install expo@latest
   npx expo install --fix
   ```
   Esto actualizará todo a versiones compatibles.

2. **O usar solo mobile:**
   - La app está diseñada para Android/iOS
   - Funcionalidades de cámara y GPS funcionan mejor en móvil
   - Web es solo para demo de UI

---

## 🚀 INICIO RÁPIDO

```bash
# 1. Asegúrate de que el servidor no esté corriendo
Ctrl+C (si está corriendo)

# 2. Limpia caché
rm -rf .expo node_modules/.cache

# 3. Inicia el servidor
npx expo start

# 4. Escanea el QR con Expo Go en tu Android
```

---

## 📸 PRUEBA LA APP

**Flujo de pantallas:**
1. 🏠 **Welcome** → Pantalla de bienvenida
2. 📷 **CameraID** → Toma foto de carnet
3. 📝 **RegisterForm** → Formulario de registro
4. 🤳 **FaceVerification** → Verificación facial
5. 🗺️ **HomeMap** → Mapa principal con botones
6. 🎮 **DemoMenu** → Menú de simulaciones
7. 🔴 **PuntosRojos** → Zonas peligrosas
8. 🆘 **Pánico** → Botón de emergencia
9. 🛣️ **TrayectoSeguro** → Rutas monitoreadas

---

## 🐛 TROUBLESHOOTING

### "Cannot connect to Metro"
```bash
# Reinicia el servidor
Ctrl+C
npx expo start --clear
```

### "Network error"
```bash
# Asegúrate de estar en la misma red WiFi
# O usa tunnel mode:
npx expo start --tunnel
```

### "Error de permisos"
- En el teléfono, acepta permisos de cámara y ubicación cuando te pregunte

---

## ✅ ESTADO ACTUAL

| Plataforma | Estado | Funcionalidad |
|------------|--------|---------------|
| **Android (Expo Go)** | ✅ FUNCIONANDO | 100% |
| **iOS (Expo Go)** | ✅ FUNCIONANDO | 100% |
| **Web** | ❌ DESACTIVADO | Incompatibilidad temporal |
| **APK Build** | ✅ LISTO | Usar EAS Build |

---

## 📱 ¡A PROBAR!

**Comando principal:**
```bash
npx expo start
```

**Luego escanea el QR con Expo Go en tu teléfono Android.**

¡Disfruta probando WARMINET! 🎉
