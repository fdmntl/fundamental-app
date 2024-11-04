module.exports = function (api) {
  api.cache(true);

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: ['react-native-reanimated/plugin'],
  };
};

// Note: 'react-native-reanimated/plugin' should always be the last entry in the plugin list, only god knows why unfortunately.
