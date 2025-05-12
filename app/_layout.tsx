import '../global.css';

import {
  DMSans_400Regular,
  DMSans_400Regular_Italic,
  DMSans_500Medium,
  DMSans_500Medium_Italic,
  DMSans_700Bold,
  DMSans_700Bold_Italic,
} from '@expo-google-fonts/dm-sans';

import { Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { PrivyProvider, PrivyElements } from '@privy-io/expo';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { useState } from 'react';

import { AppDataProvider } from '~/components/Wrappers/AppData';
import { AuthProvider } from '~/components/Wrappers/AuthProvider';
import { ThemeWrapper } from '~/components/Wrappers/ThemeWrapper';
import { toastConfig } from '~/utils/toastConfig';

const Layout = () => {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_400Regular_Italic,
    DMSans_500Medium,
    DMSans_500Medium_Italic,
    DMSans_700Bold,
    DMSans_700Bold_Italic,
    Inter_500Medium,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    console.log('Fonts not loaded yet');
    return null;
  }

  return (
    <PrivyProvider
      appId="clxd5oc5m007jrpv8y8clt6z7"
      clientId="client-WY2nCVozcYUzD3HEthM1D1PKt3cFK56DG9mKHCtbZA3Uc"
      config={{
        embedded: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
      }}>
      <AuthProvider>
        <ThemeWrapper>
          <AppDataProvider>
            <GestureHandlerRootView className="flex-1">
              <Stack screenOptions={{ headerShown: false, animation: 'none' }}>
                <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="assets/[asset]"
                  options={{ title: 'Asset Details', animation: 'default' }}
                />
                <Stack.Screen
                  name="send/[address]"
                  options={{ title: 'Send Details', animation: 'default' }}
                />
                <Stack.Screen name="details" options={{ title: 'Details', animation: 'default' }} />
                <Stack.Screen name="login" options={{ title: 'Login', gestureEnabled: false }} />
                <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
              </Stack>
            </GestureHandlerRootView>
          </AppDataProvider>
        </ThemeWrapper>
        <Toast topOffset={55} config={toastConfig} />
        <PrivyElements />
      </AuthProvider>
    </PrivyProvider>
  );
};

export default Layout;
