const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

// Expo Router'a uygulamanın 'src/app' içinde olduğunu açıkça belirtiyoruz
process.env.EXPO_ROUTER_APP_ROOT = "./src/app";

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });