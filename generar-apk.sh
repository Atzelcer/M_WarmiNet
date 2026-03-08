#!/bin/bash
# Script automatizado para generar APK de WARMINET

echo "🚀 GENERADOR DE APK - WARMINET"
echo "======================================"
echo ""

# Verificar si eas-cli está instalado
if ! command -v eas &> /dev/null; then
    echo "📦 Instalando EAS CLI..."
    npm install -g eas-cli
    echo "✅ EAS CLI instalado"
    echo ""
fi

# Verificar versión
echo "📋 Versión de EAS CLI:"
eas --version
echo ""

# Login
echo "🔐 Iniciando sesión..."
echo "   (Si no tienes cuenta, créala con: eas register)"
eas login

# Verificar login
if [ $? -eq 0 ]; then
    echo "✅ Login exitoso"
    echo ""
else
    echo "❌ Error en login. Ejecuta: eas login manualmente"
    exit 1
fi

# Compilar APK
echo "🔨 Compilando APK..."
echo "   Esto tomará 15-20 minutos"
echo "   La compilación se hace en la nube de Expo"
echo ""

eas build --platform android --profile preview --non-interactive

# Resultado
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡APK GENERADO EXITOSAMENTE!"
    echo ""
    echo "📥 Próximos pasos:"
    echo "   1. Ve al link que te mostró arriba"
    echo "   2. Descarga el archivo .apk"
    echo "   3. Transfiere el APK a tu teléfono"
    echo "   4. Instala el APK en tu Android"
    echo ""
    echo "🎉 ¡Listo para usar WARMINET!"
else
    echo ""
    echo "❌ Error al generar APK"
    echo ""
    echo "Opciones:"
    echo "1. Revisa el error arriba"
    echo "2. Ejecuta manualmente: eas build --platform android --profile preview"
    echo "3. O consulta: GENERAR_APK.md"
fi
