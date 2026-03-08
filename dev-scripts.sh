#!/bin/bash

# WarmiNet - Scripts de Desarrollo Útiles
# Para Windows PowerShell, usar: powershell -ExecutionPolicy Bypass -File dev-scripts.ps1

echo "🛡️  WarmiNet - Scripts de Desarrollo"
echo "======================================"

# Función para mostrar menú
show_menu() {
    echo ""
    echo "Selecciona una opción:"
    echo "1) Iniciar app en modo desarrollo"
    echo "2) Iniciar con caché limpia"
    echo "3) Iniciar en Android (emulador)"
    echo "4) Compilar APK (EAS Build)"
    echo "5) Instalar dependencias"
    echo "6) Verificar estructura de assets"
    echo "7) Ver logs en tiempo real"
    echo "8) Limpiar todo y reinstalar"
    echo "9) Salir"
    echo ""
}

# Iniciar app
start_app() {
    echo "▶️  Iniciando WarmiNet..."
    npm start
}

# Iniciar con caché limpia
start_clean() {
    echo "🧹 Limpiando caché..."
    expo start -c
}

# Iniciar en Android
start_android() {
    echo "📱 Iniciando en Android..."
    npm run android
}

# Compilar APK
build_apk() {
    echo "🔨 Compilando APK..."
    echo "⚠️  Asegúrate de tener EAS CLI instalado: npm install -g eas-cli"
    read -p "¿Continuar? (s/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Ss]$ ]]
    then
        eas build --platform android --profile preview
    fi
}

# Instalar dependencias
install_deps() {
    echo "📦 Instalando dependencias..."
    npm install
    echo "✅ Dependencias instaladas"
}

# Verificar assets
check_assets() {
    echo "🖼️  Verificando estructura de assets..."
    
    folders=("assets/logo" "assets/carnets" "assets/puntos_rojos" "assets/panico")
    
    for folder in "${folders[@]}"
    do
        if [ -d "$folder" ]; then
            echo "✅ $folder existe"
            file_count=$(ls -1 "$folder" 2>/dev/null | wc -l)
            echo "   Archivos: $file_count"
        else
            echo "❌ $folder NO existe"
        fi
    done
    
    echo ""
    echo "⚠️  Recuerda agregar los assets reales según assets/README_ASSETS.md"
}

# Ver logs
show_logs() {
    echo "📋 Mostrando logs..."
    npx expo start --dev-client
}

# Limpiar y reinstalar
clean_reinstall() {
    echo "🧹 Limpiando proyecto..."
    rm -rf node_modules
    rm -rf .expo
    rm -rf .expo-shared
    echo "📦 Reinstalando dependencias..."
    npm install
    echo "✅ Proyecto limpio y reinstalado"
}

# Bucle principal
while true; do
    show_menu
    read -p "Opción: " option
    
    case $option in
        1)
            start_app
            ;;
        2)
            start_clean
            ;;
        3)
            start_android
            ;;
        4)
            build_apk
            ;;
        5)
            install_deps
            ;;
        6)
            check_assets
            ;;
        7)
            show_logs
            ;;
        8)
            clean_reinstall
            ;;
        9)
            echo "👋 ¡Hasta luego!"
            exit 0
            ;;
        *)
            echo "❌ Opción inválida"
            ;;
    esac
    
    echo ""
    read -p "Presiona Enter para continuar..."
done
