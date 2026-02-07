const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-i18next') {
    return {
      filePath: path.resolve(__dirname, 'node_modules/react-i18next/dist/commonjs/index.js'),
      type: 'sourceFile',
    };
  }
  if (moduleName === 'react-i18next/initReactI18next') {
    return {
      filePath: path.resolve(__dirname, 'node_modules/react-i18next/dist/commonjs/initReactI18next.js'),
      type: 'sourceFile',
    };
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
