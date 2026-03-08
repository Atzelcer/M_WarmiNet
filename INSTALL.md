# Instalación Paso a Paso - WarmiNet

Esta guía te llevará desde cero hasta tener la app funcionando en tu teléfono Android.

## ⏱️ Tiempo estimado: 30-45 minutos

---

## Fase 1: Preparación del entorno (15-20 min)

### Paso 1.1: Instalar Node.js
1. Ve a https://nodejs.org/
2. Descarga la versión LTS (v18 o superior)
3. Ejecuta el instalador
4. Verifica la instalación:
   ```bash
   node --version
   npm --version
   ```
   Deberías ver las versiones instaladas.

### Paso 1.2: Instalar Expo CLI
```bash
npm install -g expo-cli
```

Verifica:
```bash
expo --version
```

### Paso 1.3: Instalar Expo Go en tu teléfono
1. Abre Google Play Store
2. Busca "Expo Go"
3. Instala la aplicación
4. Abre la app (solo para verificar que funciona)

---

## Fase 2: Configuración del proyecto (5-10 min)

### Paso 2.1: Navegar al proyecto
```bash
cd d:\UNIVALLE\M_WarmiNet
```

### Paso 2.2: Instalar dependencias
```bash
npm install
```
⏳ Esto tomará 3-5 minutos. Es normal.

### Paso 2.3: Preparar assets básicos

**Opción A - Temporales (rápido):**
Descarga imágenes placeholder de internet y colócalas en:
- `assets/logo/icon.png` (cualquier imagen cuadrada)
- `assets/carnets/carnet_mujer.jpg` (cualquier foto de CI)
- `assets/carnets/carnet_hombre.jpg` (cualquier foto de CI)
- `assets/puntos_rojos/rojo1.jpg` (foto de calle)
- `assets/puntos_rojos/rojo2.jpg` (foto de calle)
- `assets/puntos_rojos/rojo3.jpg` (foto de calle)

**Opción B - Reales:**
Ver especificaciones en `assets/README_ASSETS.md`

### Paso 2.4: Configurar Google Maps (OPCIONAL)

Si quieres que el mapa funcione correctamente:

1. Ve a https://console.cloud.google.com/
2. Crea un proyecto nuevo
3. Habilita "Maps SDK for Android"
4. Crea una API Key
5. Edita `app.json` línea 29:
   ```json
   "apiKey": "TU_API_KEY_AQUI"
   ```

⚠️ **Nota**: Puedes saltarte este paso. La app funcionará sin mapas, solo con fondo gris.

---

## Fase 3: Primera ejecución (5 min)

### Paso 3.1: Iniciar el servidor de desarrollo
```bash
npm start
```

Espera a que aparezca un QR code en la terminal.

### Paso 3.2: Conectar tu teléfono

**Importante**: Tu teléfono y PC deben estar en la misma red WiFi.

1. Abre **Expo Go** en tu teléfono
2. Toca "Scan QR code"
3. Escanea el QR que aparece en la terminal
4. Espera a que la app se cargue (30-60 segundos primera vez)

### Paso 3.3: Aceptar permisos
Cuando la app se abra, acepta los permisos de:
- 📷 Cámara
- 📍 Ubicación
- 📁 Almacenamiento

---

## Fase 4: Probar funcionalidades (10-15 min)

### Test 1: Navegación básica
1. Deberías ver la pantalla de bienvenida con el logo
2. Toca "Ir directo a DEMOS"
3. Verifica que aparece el menú con 4 opciones

✅ Si llegaste aquí, la instalación fue exitosa.

### Test 2: Mapa Principal
1. En el menú de demos, toca "🗺️ Mapa Principal"
2. Deberías ver un mapa centrado en Sucre, Bolivia
3. Deberían aparecer 3 marcadores rojos
4. Toca un marcador rojo → aparece descripción

✅ Si no ves el mapa (solo gris), necesitas configurar Google Maps API Key.

### Test 3: Puntos Rojos
1. Vuelve al menú de demos
2. Toca "📍 Puntos Rojos"
3. Cambia entre los 3 escenarios (botones superiores)
4. En Escenario 2, toca "Simular acercamiento"

Deberías:
- Sentir vibración 📳
- Ver alerta emergente
- Ver foto de evidencia

✅ Si todo funciona, perfecto.

### Test 4: Botón Pánico
1. Menú demos → "🚨 Botón Pánico 3s"
2. **Mantén presionado** el botón rojo grande por 3 segundos
3. Deberías ver:
   - Contador de tiempo
   - Mensaje "PÁNICO ACTIVADO"
   - Simulación de grabación
4. Toca "Confirmar ayuda" dos veces
5. Verifica que aparece "LLAMANDO A LA POLICÍA"

✅ Funcionalidad clave verificada.

### Test 5: Trayecto Seguro
1. Menú demos → "🛣️ Trayecto Seguro"
2. Toca "🛣️ Iniciar trayecto"
3. Observa el contador
4. Espera a que llegue a 0 (30 segundos en demo)
5. En la ruta 2, toca "Extender tiempo"

✅ Sistema de monitoreo funcionando.

---

## Fase 5: Compilar APK (OPCIONAL - 20-30 min)

Si quieres instalar la app permanentemente sin Expo Go:

### Paso 5.1: Crear cuenta Expo
1. Ve a https://expo.dev/signup
2. Crea una cuenta gratuita

### Paso 5.2: Instalar EAS CLI
```bash
npm install -g eas-cli
```

### Paso 5.3: Login
```bash
eas login
```
Ingresa tu email y contraseña de Expo.

### Paso 5.4: Configurar build
```bash
eas build:configure
```
Acepta las opciones por defecto.

### Paso 5.5: Compilar
```bash
eas build --platform android --profile preview
```

Esto subirá tu código a los servidores de Expo y compilará en la nube.
⏳ Tomará 10-15 minutos.

### Paso 5.6: Descargar e instalar
1. Cuando termine, recibirás un link de descarga
2. Abre el link en tu teléfono
3. Descarga el APK
4. Habilita "Instalar apps de fuentes desconocidas"
5. Instala el APK

🎉 ¡App instalada permanentemente!

---

## 🐛 Solución de problemas

### "npm install falla"
```bash
# Limpiar caché
npm cache clean --force
# Reintentar
npm install
```

### "Expo Go no puede conectarse"
```bash
# Usar túnel (más lento pero más confiable)
expo start --tunnel
```

### "La app se cierra inmediatamente"
- Verifica que aceptaste todos los permisos
- Ve a Configuración → Apps → WarmiNet → Permisos
- Habilita todos los permisos manualmente

### "No veo el código QR"
- Usa el comando: `expo start --web` para ver en navegador
- O conecta mediante link manual en Expo Go

### "Error: Google Maps API Key"
- Si no configuraste el API Key, el mapa se verá gris
- La app sigue funcionando, solo sin mapas visuales

### "Pantalla blanca"
```bash
# Reiniciar con caché limpia
expo start -c
```

---

## 📝 Checklist de instalación

Marca cada item cuando lo completes:

- [ ] Node.js instalado y verificado
- [ ] Expo CLI instalado globalmente
- [ ] Expo Go instalado en teléfono
- [ ] Navegado a carpeta del proyecto
- [ ] Dependencias instaladas con `npm install`
- [ ] Assets básicos agregados
- [ ] Servidor iniciado con `npm start`
- [ ] App cargada en teléfono vía QR
- [ ] Permisos de cámara aceptados
- [ ] Permisos de ubicación aceptados
- [ ] Pantalla de bienvenida visible
- [ ] Menú de demos funcional
- [ ] Mapa principal cargado
- [ ] Puntos rojos funcionando
- [ ] Botón pánico testeado
- [ ] Trayecto seguro verificado

---

## 🎯 Próximos pasos

Una vez que todo funcione:

1. **Explora todas las demos** para familiarizarte
2. **Prueba el flujo completo de registro** (desde Welcome)
3. **Lee la documentación**:
   - `README.md` - Overview general
   - `docs/ARCHITECTURE.md` - Cómo está construido
   - `docs/SECURITY_UX.md` - Decisiones de diseño
4. **Personaliza** según tus necesidades
5. **Compila el APK** para distribución

---

## 💡 Tips adicionales

### Para desarrollo más cómodo:
```bash
# Ver logs en tiempo real
npx react-native log-android

# Reload rápido
Presiona 'r' en la terminal donde corre Expo
O sacude el teléfono y selecciona "Reload"
```

### Para debugging:
```bash
# Activar debug en Chrome
Sacude el teléfono → Debug Remote JS
```

### Scripts útiles:
```bash
# Windows
.\dev-scripts.ps1

# Linux/Mac
./dev-scripts.sh
```

---

## 📞 ¿Necesitas ayuda?

Si encuentras problemas:
1. Revisa el [CHECKLIST.md](CHECKLIST.md)
2. Consulta [BUILD_GUIDE.md](docs/BUILD_GUIDE.md)
3. Busca el error en https://docs.expo.dev/

---

**¡Felicidades! Ahora tienes WarmiNet funcionando** 🎉

La app está lista para demostraciones y personalización según tus necesidades.
