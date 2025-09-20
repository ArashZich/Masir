const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add support for TypeScript path mapping
config.resolver.alias = {
  '@': path.resolve(__dirname, './'),
  '@/components': path.resolve(__dirname, './components'),
  '@/constants': path.resolve(__dirname, './constants'),
  '@/hooks': path.resolve(__dirname, './hooks'),
  '@/assets': path.resolve(__dirname, './assets'),
  '@/app': path.resolve(__dirname, './app'),
  '@/locales': path.resolve(__dirname, './locales'),
};

module.exports = config;