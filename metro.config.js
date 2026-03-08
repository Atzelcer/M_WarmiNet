// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// WORKAROUND para el error "node:sea" en Windows
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Interceptar y bloquear módulos nativos de Node.js
  if (moduleName.startsWith('node:')) {
    console.warn(`⚠️ Bloqueando módulo nativo: ${moduleName}`);
    return {
      type: 'empty',
    };
  }
  
  // Para todo lo demás, usar el resolver por defecto
  return context.resolveRequest(context, moduleName, platform);
};

// Configuración para web: resolver react-native a react-native-web
config.resolver.alias = {
  'react-native': 'react-native-web',
};

// Configurar sourceExts
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx', 'mjs'];

// Configurar transformer
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: false,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

module.exports = config;
