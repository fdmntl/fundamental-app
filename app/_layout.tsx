import '../global.css';

import {
  DMSans_400Regular,
  DMSans_400Regular_Italic,
  DMSans_500Medium,
  DMSans_500Medium_Italic,
  DMSans_700Bold,
  DMSans_700Bold_Italic,
} from '@expo-google-fonts/dm-sans';
import {
  DMSerifText_400Regular,
  DMSerifText_400Regular_Italic,
} from '@expo-google-fonts/dm-serif-text';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { PrivyProvider, PrivyElements } from '@privy-io/expo';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { View, Text } from 'react-native';
import { useState, useEffect } from 'react';
import Constants from 'expo-constants';

import { AppDataProvider } from '~/components/Wrappers/AppData';
import { ThemeWrapper } from '~/components/Wrappers/ThemeWrapper';
import { toastConfig } from '~/utils/toastConfig';

const Layout = () => {
  const [error, setError] = useState<string | null>(null);
  const [fontsLoaded] = useFonts({
    DMSerifText_400Regular,
    DMSerifText_400Regular_Italic,
    DMSans_400Regular,
    DMSans_400Regular_Italic,
    DMSans_500Medium,
    DMSans_500Medium_Italic,
    DMSans_700Bold,
    DMSans_700Bold_Italic,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    console.log('App layout mounting');
    try {
      // Check if Privy app ID is available
      const privyAppId = Constants.expoConfig?.extra?.privyAppId;
      console.log('Privy App ID:', privyAppId);

      if (!privyAppId) {
        setError('Missing Privy App ID. Check your app configuration.');
      }
    } catch (e) {
      console.error('Error in _layout initialization:', e);
      if (e instanceof Error) {
        setError(`Initialization error: ${e.message}`);
      } else {
        setError('Initialization error');
      }
    }
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red', fontSize: 16, marginBottom: 10 }}>Error:</Text>
        <Text style={{ textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  if (!fontsLoaded) {
    console.log('Fonts not loaded yet');
    return null;
  }

  console.log('Rendering main app layout');
  return (
    <PrivyProvider
      appId="clxd5oc5m007jrpv8y8clt6z7"
      clientId="client-WY2nCVozcYUzD3HEthM1D1PKt3cFK56DG9mKHCtbZA3Uc">
      <ThemeWrapper>
        <AppDataProvider>
          <GestureHandlerRootView className="flex-1">
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
              <Stack.Screen name="assets/[asset]" options={{ title: 'Asset Details' }} />
              <Stack.Screen name="send/[address]" options={{ title: 'Send Details' }} />
              <Stack.Screen name="details" options={{ title: 'Details' }} />
              <Stack.Screen name="login" options={{ title: 'Login', gestureEnabled: false }} />
              <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
            </Stack>
          </GestureHandlerRootView>
        </AppDataProvider>
      </ThemeWrapper>
      <Toast topOffset={55} config={toastConfig} />
      <PrivyElements />
    </PrivyProvider>
  );
};

export default Layout;
