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

import { AppDataProvider } from '~/components/Wrappers/AppData';
import { ThemeWrapper } from '~/components/Wrappers/ThemeWrapper';
import { toastConfig } from '~/utils/toastConfig';

const Layout = () => {
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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <PrivyProvider
      appId="clxd5oc5m007jrpv8y8clt6z7"
      config={{
        embedded: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
      }}>
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
