#!/bin/bash
# Script de diagnóstico para encontrar el error

echo "🔍 DIAGNÓSTICO WARMINET"
echo "======================="
echo ""

# 1. Verificar assets
echo "1. Verificando assets..."
if [ -f "assets/logo/logo_warminet.png" ]; then
    echo "   ✅ Logo encontrado"
else
    echo "   ❌ Logo NO encontrado"
fi

if [ -f "assets/icon.png" ]; then
    echo "   ✅ Icon encontrado"
else
    echo "   ❌ Icon NO encontrado"
fi

if [ -f "assets/adaptive-icon.png" ]; then
    echo "   ✅ Adaptive icon encontrado"
else
    echo "   ❌ Adaptive icon NO encontrado"
fi

echo ""

# 2. Verificar archivos críticos
echo "2. Verificando archivos críticos..."
critical_files=(
    "App.js"
    "app.json"
    "package.json"
    "src/screens/WelcomeScreen.js"
    "src/screens/HomeMapScreen.js"
    "src/data/mockData.js"
    "src/constants/colors.js"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file FALTANTE"
    fi
done

echo ""

# 3. Verificar node_modules
echo "3. Verificando node_modules..."
if [ -d "node_modules" ]; then
    echo "   ✅ node_modules existe"
    if [ -d "node_modules/expo" ]; then
        echo "   ✅ expo instalado"
    else
        echo "   ❌ expo NO instalado - ejecuta: npm install"
    fi
else
    echo "   ❌ node_modules NO existe - ejecuta: npm install"
fi

echo ""

# 4. Verificar sintaxis JS (simple)
echo "4. Verificando sintaxis básica..."
if node -c App.js 2>/dev/null; then
    echo "   ✅ App.js sin errores de sintaxis"
else
    echo "   ❌ App.js tiene errores de sintaxis"
fi

echo ""
echo "======================="
echo "🔍 Diagnóstico completado"
echo ""
echo "Próximos pasos:"
echo "1. Si hay archivos faltantes, ejecuta: npm install"
echo "2. Si hay errores de sintaxis, revísalos arriba"
echo "3. Ejecuta: npx expo start --clear"
echo "4. Comparte los errores de la terminal si sigue fallando"
