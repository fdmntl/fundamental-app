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
import { PostHogProvider } from 'posthog-react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { SendFeedbackButton } from '~/components/Feedback/sendFeedbackButton';
import { AppDataProvider } from '~/components/Wrappers/AppData';
import { AuthProvider } from '~/components/Wrappers/AuthProvider';
import { ThemeWrapper } from '~/components/Wrappers/ThemeWrapper';
import { posthog } from '~/utils/postHogClient';
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
    return null;
  }

  return (
    <PostHogProvider client={posthog}>
      <PrivyProvider
        appId="clxd5oc5m007jrpv8y8clt6z7"
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
                  <Stack.Screen
                    name="details"
                    options={{ title: 'Details', animation: 'default' }}
                  />
                  <Stack.Screen name="login" options={{ title: 'Login', gestureEnabled: false }} />
                  <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
                </Stack>
                <SendFeedbackButton />
              </GestureHandlerRootView>
            </AppDataProvider>
          </ThemeWrapper>
          <Toast topOffset={55} config={toastConfig} />
          <PrivyElements />
        </AuthProvider>
      </PrivyProvider>
    </PostHogProvider>
  );
};

export default Layout;
