// file: index.ts

// polyfills
import 'fast-text-encoding';
import 'react-native-get-random-values';
import '@ethersproject/shims';

// Override 'atob' to fix base64 decoding issues on Android
if (typeof atob === 'undefined') {
  global.atob = function (input) {
    return Buffer.from(input, 'base64').toString('binary');
  };
}

// If 'atob' exists but has issues, override it
const _atob = global.atob;

global.atob = (val) => {
  try {
    return _atob(val);
  } catch (e) {
    return _atob(val + '=');
  }
};

import 'expo-router/entry';
