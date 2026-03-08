# 📦 GUÍA PARA GENERAR APK DE WARMINET

## 🎯 OBJETIVO: APK instalable en 15-20 minutos

---

## ✅ MÉTODO 1: EAS BUILD (RECOMENDADO)

### Paso 1: Instalar EAS CLI
```bash
npm install -g eas-cli
```

### Paso 2: Crear cuenta Expo (si no tienes)
```bash
eas login
# Si no tienes cuenta: eas register
```

### Paso 3: Compilar APK
```bash
cd D:/UNIVALLE/M_WarmiNet
eas build --platform android --profile preview
```

### Paso 4: Esperar (15-20 min)
- La compilación se hace en la nube de Expo
- Te dará un link para ver el progreso
- Ejemplo: https://expo.dev/accounts/[tu-usuario]/projects/warminet/builds/...

### Paso 5: Descargar APK
- Cuando termine, te dará un link de descarga
- Descarga el archivo `.apk`
- Tamaño aproximado: 50-80 MB

### Paso 6: Instalar en tu teléfono
1. Transfiere el APK a tu teléfono (USB, WhatsApp, Drive, etc.)
2. Toca el archivo APK en tu teléfono
3. Acepta "Instalar aplicaciones desconocidas" si pregunta
4. ¡Listo!

---

## 🚀 MÉTODO 2: APK LOCAL (MÁS RÁPIDO, PERO REQUIERE ANDROID SDK)

### Requisitos:
- Android Studio instalado
- SDK configurado

### Pasos:
```bash
# 1. Detener servidor Expo (Ctrl+C)

# 2. Generar carpeta android
npx expo prebuild --platform android --clean

# 3. Compilar APK
cd android
./gradlew assembleRelease

# 4. APK estará en:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## ⚡ MÉTODO 3: EXPO SNACK (VER UI AHORA MISMO)

**Si solo quieres VER cómo se ve:**

1. Ve a: https://snack.expo.dev
2. Crea nuevo proyecto
3. Pega el contenido de `App.js`
4. Ve en el simulador web o escanea QR con Expo Go

**No instala nada, pero puedes probar la UI inmediatamente**

---

## 🔥 COMANDOS EXACTOS (COPIAR Y PEGAR)

### Para generar APK con EAS:

```bash
# Paso 1: Instalar EAS
npm install -g eas-cli

# Paso 2: Login (crea cuenta si no tienes)
eas login

# Paso 3: Compilar
cd D:/UNIVALLE/M_WarmiNet
eas build --platform android --profile preview

# Seguir instrucciones en pantalla
# Te preguntará algunas cosas, di "yes" a todo
```

### Alternativa: Build local (si tienes Android Studio)

```bash
# Detener Expo primero (Ctrl+C)
cd D:/UNIVALLE/M_WarmiNet
npx expo run:android --variant release
```

---

## 📱 DESPUÉS DE TENER EL APK

### Instalar en tu Android:

**Opción A: USB**
```bash
# Con teléfono conectado por USB
adb install app-release.apk
```

**Opción B: Transferir archivo**
1. Envía el APK a tu teléfono (WhatsApp, Drive, etc.)
2. Abre el archivo en el teléfono
3. Toca "Instalar"
4. ¡Listo!

---

## 🐛 TROUBLESHOOTING

### Error: "eas: command not found"
```bash
# Instalar globalmente
npm install -g eas-cli

# Verificar instalación
eas --version
```

### Error: "You need to be logged in"
```bash
eas login
# O crear cuenta:
eas register
```

### Error: "Android SDK not found" (método local)
- Instala Android Studio: https://developer.android.com/studio
- Configura SDK en Android Studio

---

## ⏱️ TIEMPO ESTIMADO

| Método | Tiempo | Dificultad |
|--------|--------|------------|
| **EAS Build** | 15-20 min | ⭐ Fácil |
| Build Local | 5-10 min | ⭐⭐⭐ Difícil (necesita SDK) |
| Expo Snack | 2 minutos | ⭐ Muy fácil (solo ver UI) |

---

## 🎯 RECOMENDACIÓN

**USA EAS BUILD (Método 1):**
1. Más fácil
2. No necesita Android Studio
3. Funciona en cualquier PC
4. APK completo y firmado

**Comandos resumidos:**
```bash
npm install -g eas-cli
eas login
cd D:/UNIVALLE/M_WarmiNet
eas build --platform android --profile preview
```

**Espera 15-20 minutos → Descarga APK → Instala en tu teléfono → ¡Listo!**

---

## 📞 SIGUIENTE PASO

**Ejecuta ahora en tu terminal:**

```bash
npm install -g eas-cli
```

Y cuéntame cuando termine para continuar con el paso 2.
