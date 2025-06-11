module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '~': './',
            assets: './assets',
          },
        },
      ],
      'react-native-reanimated/plugin', // must stay last
    ],
  };
};
