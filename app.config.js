import 'dotenv/config';

export default {
  expo: {
    name: 'Fundamental',
    slug: 'Fundamental',
    version: '1.4.1',
    scheme: 'com.fundamental.fundamentalapp', // Changed from 'Fundamental' to use bundle identifier
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/favicon.ico',
    },
    plugins: ['expo-router', 'expo-secure-store', 'expo-font', 'expo-localization'],
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true,
    },
    orientation: 'portrait',
    icon: './assets/app-icon.png',
    userInterfaceStyle: 'dark',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#18141F',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.fundamental.fundamentalapp',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      buildNumber: '5',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptative-icon.png',
        backgroundColor: '#18141F',
      },
      package: 'com.fundamental.fundamentalapp',
      minSdkVersion: 26,
      intentFilters: [
        {
          action: 'VIEW',
          data: [
            {
              scheme: 'com.fundamental.fundamentalapp',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
      versionCode: 5,
    },
    extra: {
      privyAppId: 'clxd5oc5m007jrpv8y8clt6z7',
      privyClientId: 'client-WY2nCVozcYUzD3HEthM1D1PKt3cFK56DG9mKHCtbZA3Uc',
      router: {
        origin: false,
      },
      eas: {
        projectId: 'b6bd4dc1-4982-4321-ab53-5690af646b68',
      },
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_KEY,
      ignoreUpdates: process.env.EXPO_PUBLIC_IGNORE_UPDATES === 'true',
    },
    owner: 'fundamental',
  },
};