const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Force la redirection de react-native-linear-gradient vers expo-linear-gradient sur le Web
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-native-linear-gradient': require.resolve('expo-linear-gradient'),
};

module.exports = config;
