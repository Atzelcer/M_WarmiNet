# WarmiNet - Scripts de Desarrollo para Windows PowerShell

Write-Host "🛡️  WarmiNet - Scripts de Desarrollo" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

function Show-Menu {
    Write-Host ""
    Write-Host "Selecciona una opción:" -ForegroundColor Yellow
    Write-Host "1) Iniciar app en modo desarrollo"
    Write-Host "2) Iniciar con caché limpia"
    Write-Host "3) Iniciar en Android (emulador)"
    Write-Host "4) Compilar APK (EAS Build)"
    Write-Host "5) Instalar dependencias"
    Write-Host "6) Verificar estructura de assets"
    Write-Host "7) Ver logs en tiempo real"
    Write-Host "8) Limpiar todo y reinstalar"
    Write-Host "9) Abrir documentación"
    Write-Host "0) Salir"
    Write-Host ""
}

function Start-App {
    Write-Host "▶️  Iniciando WarmiNet..." -ForegroundColor Green
    npm start
}

function Start-Clean {
    Write-Host "🧹 Limpiando caché..." -ForegroundColor Green
    expo start -c
}

function Start-Android {
    Write-Host "📱 Iniciando en Android..." -ForegroundColor Green
    npm run android
}

function Build-APK {
    Write-Host "🔨 Compilando APK..." -ForegroundColor Green
    Write-Host "⚠️  Asegúrate de tener EAS CLI instalado: npm install -g eas-cli" -ForegroundColor Yellow
    $response = Read-Host "¿Continuar? (s/n)"
    if ($response -eq "s" -or $response -eq "S") {
        eas build --platform android --profile preview
    }
}

function Install-Deps {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Green
    npm install
    Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
}

function Check-Assets {
    Write-Host "🖼️  Verificando estructura de assets..." -ForegroundColor Green
    
    $folders = @("assets\logo", "assets\carnets", "assets\puntos_rojos", "assets\panico")
    
    foreach ($folder in $folders) {
        if (Test-Path $folder) {
            Write-Host "✅ $folder existe" -ForegroundColor Green
            $fileCount = (Get-ChildItem $folder -File).Count
            Write-Host "   Archivos: $fileCount" -ForegroundColor Gray
        } else {
            Write-Host "❌ $folder NO existe" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "⚠️  Recuerda agregar los assets reales según assets\README_ASSETS.md" -ForegroundColor Yellow
}

function Show-Logs {
    Write-Host "📋 Mostrando logs..." -ForegroundColor Green
    npx expo start --dev-client
}

function Clean-Reinstall {
    Write-Host "🧹 Limpiando proyecto..." -ForegroundColor Green
    Remove-Item -Recurse -Force -ErrorAction SilentlyContinue node_modules
    Remove-Item -Recurse -Force -ErrorAction SilentlyContinue .expo
    Remove-Item -Recurse -Force -ErrorAction SilentlyContinue .expo-shared
    Write-Host "📦 Reinstalando dependencias..." -ForegroundColor Green
    npm install
    Write-Host "✅ Proyecto limpio y reinstalado" -ForegroundColor Green
}

function Open-Docs {
    Write-Host "📚 Abriendo documentación..." -ForegroundColor Green
    Start-Process "README.md"
}

# Bucle principal
while ($true) {
    Show-Menu
    $option = Read-Host "Opción"
    
    switch ($option) {
        "1" { Start-App }
        "2" { Start-Clean }
        "3" { Start-Android }
        "4" { Build-APK }
        "5" { Install-Deps }
        "6" { Check-Assets }
        "7" { Show-Logs }
        "8" { Clean-Reinstall }
        "9" { Open-Docs }
        "0" { 
            Write-Host "👋 ¡Hasta luego!" -ForegroundColor Cyan
            exit 
        }
        default { 
            Write-Host "❌ Opción inválida" -ForegroundColor Red 
        }
    }
    
    Write-Host ""
    Read-Host "Presiona Enter para continuar..."
    Clear-Host
}
