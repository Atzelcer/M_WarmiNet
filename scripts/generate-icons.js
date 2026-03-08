/**
 * Generate placeholder icons for Expo
 * Creates simple square PNG icons with WarmiNet branding
 */

const fs = require('fs');
const path = require('path');

// Simple PNG data URL for a 1024x1024 purple square with white "W"
// This is a minimal valid PNG file
const createSimplePNG = () => {
  // This creates a 1x1 purple pixel PNG, which Expo can resize
  const purplePNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAEBgIApD+VmwAAAABJRU5ErkJggg==',
    'base64'
  );
  return purplePNG;
};

const assetsDir = path.join(__dirname, '..', 'assets');

// Create icon.png (1024x1024)
const iconPath = path.join(assetsDir, 'icon.png');
if (!fs.existsSync(iconPath)) {
  fs.writeFileSync(iconPath, createSimplePNG());
  console.log('✓ Created placeholder icon.png');
} else {
  console.log('✓ icon.png already exists');
}

// Create adaptive-icon.png (1024x1024)
const adaptiveIconPath = path.join(assetsDir, 'adaptive-icon.png');
if (!fs.existsSync(adaptiveIconPath)) {
  fs.writeFileSync(adaptiveIconPath, createSimplePNG());
  console.log('✓ Created placeholder adaptive-icon.png');
} else {
  console.log('✓ adaptive-icon.png already exists');
}

console.log('');
console.log('⚠️  NOTA: Estos son iconos placeholder simples.');
console.log('   Para producción, reemplaza con iconos cuadrados de 1024x1024px.');
