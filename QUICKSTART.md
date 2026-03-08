# Guía de Inicio Rápido - WarmiNet

## ⚡ Inicio rápido en 3 pasos

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar (opcional)
- Agrega tu Google Maps API key en `app.json` (línea 29)
- Coloca imágenes de ejemplo en carpeta `assets/`

### 3. Ejecutar
```bash
npm start
```
Escanea el QR con **Expo Go** en tu teléfono Android.

## 📱 Probar funcionalidades

### Ruta corta (recomendada para demo):
1. En pantalla de bienvenida → "Ir directo a DEMOS"
2. Selecciona cualquier simulación:
   - **Puntos Rojos**: Crea y visualiza zonas peligrosas
   - **Pánico**: Prueba el botón de emergencia 3s
   - **Trayecto Seguro**: Monitoreo de rutas con temporizador

### Ruta completa (flujo de registro):
1. "Crear cuenta"
2. Sube/toma fotos de CI (usa imagen con "mujer" en el nombre)
3. Completa formulario con datos
4. Verifica rostro (espera 5 segundos)
5. Accede al mapa principal

## 🗺️ En el mapa principal:
- **Botones laterales**: Acceso rápido a simulaciones
- **Pins rojos**: Zonas peligrosas (toca para ver detalles)
- **Menú (☰)**: Volver al menú de demos

## 🎯 Tips para la demo:

### Puntos Rojos:
- **Escenario 1**: Prueba crear un punto rojo (long-press en mapa)
- **Escenario 2 y 3**: Simula acercamiento a puntos existentes

### Botón Pánico:
- Mantén presionado el botón rojo 3 segundos
- Observa la grabación simulada
- Presiona "Confirmar ayuda" 2 veces
- Ve cómo se activa llamada a policía

### Trayecto Seguro:
- **Ruta 1**: Deja que expire el tiempo (no extiendas)
- **Ruta 2**: Presiona "Extender tiempo" cuando aparezca
- **Ruta 3**: Igual que Ruta 1

## ⚙️ Comandos útiles

```bash
# Iniciar en modo desarrollo
npm start

# Iniciar en Android (con emulador)
npm run android

# Limpiar caché si hay problemas
expo start -c

# Ver logs detallados
expo start --dev-client
```

## 🔧 Solución de problemas comunes

### "No puedo ver el mapa"
→ Configura Google Maps API key en `app.json`

### "La app se cierra al abrir cámara"
→ Acepta permisos manualmente en el teléfono

### "No se cargan las imágenes"
→ Coloca imágenes de ejemplo en `assets/` (ver README_ASSETS.md)

### "Expo Go no conecta"
→ Usa túnel: `expo start --tunnel`

## 🚀 Compilar APK

Forma más rápida:
```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```
Descarga el APK cuando esté listo (~10-15 min).

## 📚 Más información

- **README completo**: `README.md`
- **Guía de compilación**: `docs/BUILD_GUIDE.md`
- **Configuración AWS**: `docs/AWS_SETUP.md`

## 💡 Estructura de navegación

```
WelcomeScreen
├── DemoMenu (acceso rápido)
│   ├── HomeMap
│   ├── PuntosRojos
│   ├── Panico
│   └── TrayectoSeguro
└── CameraID (flujo completo)
    └── RegisterForm
        └── FaceVerification
            └── HomeMap
```

---

**¿Listo para empezar?** → `npm start` 🎉
