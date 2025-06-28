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
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { PrivyProvider, PrivyElements } from '@privy-io/expo';
import { useFonts } from 'expo-font';
import { Stack, useNavigationContainerRef } from 'expo-router';
import { PostHogProvider, PostHogSurveyProvider } from 'posthog-react-native';
import { useEffect, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

import { SurveyModal } from '~/components/Survey/SurveyModal';
import { SendFeedbackButton } from '~/components/Feedback/sendFeedbackButton';
import { UpdateChecker } from '~/components/Update/UpdateChecker';
import { AppDataProvider } from '~/components/Wrappers/AppData';
import { AuthProvider } from '~/components/Wrappers/AuthProvider';
import { ThemeWrapper } from '~/components/Wrappers/ThemeWrapper';
import { useSurveyManager } from '~/hooks/useSurveyManager';
import { trackEvent } from '~/services/PostHog/trackEvent';
import { posthog } from '~/utils/postHogClient';
import { toastConfig } from '~/utils/toastConfig';

const Layout = () => {
  const navRef = useNavigationContainerRef();
  const routeNameRef = useRef<string | null>(null);
  const { isSurveyVisible, survey, handleCloseSurvey } = useSurveyManager('nps');

  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_400Regular_Italic,
    DMSans_500Medium,
    DMSans_500Medium_Italic,
    DMSans_700Bold,
    DMSans_700Bold_Italic,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Track app opened event
  useEffect(() => {
    trackEvent('app_opened');
  }, []);

  // Track screen views
  useEffect(() => {
    const unsubscribe = navRef.addListener('state', () => {
      const currentRoute = navRef.getCurrentRoute();
      if (!currentRoute) return;

      if (routeNameRef.current !== currentRoute.name) {
        trackEvent('page_view', {
          screen: currentRoute.name,
        });
        routeNameRef.current = currentRoute.name;
      }
    });

    return unsubscribe;
  }, [navRef]);

  if (!fontsLoaded) {
    console.log('Fonts not loaded yet');
    return null;
  }

  return (
    <PostHogProvider
      client={posthog}
      autocapture={{
        captureTouches: true,
        captureLifecycleEvents: true,
        captureScreens: true,
        ignoreLabels: [],
        customLabelProp: 'ph-label',
        noCaptureProp: 'ph-no-capture',
        navigation: {
          routeToName: (name, params) => {
            if (params?.id) return `${name}/${params.id}`;
            return name;
          },
          routeToProperties: (name, params) => {
            if (name === 'SensitiveScreen') return undefined;
            return params;
          },
        },
      }}>
      <PostHogSurveyProvider>
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
                  <Stack screenOptions={{ headerShown: false, animation: 'default' }}>
                    <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
                    <Stack.Screen
                      name="assets/[asset]"
                      options={{ title: 'Asset Details', animation: 'default' }}
                    />
                    <Stack.Screen
                      name="details"
                      options={{ title: 'Details', animation: 'default' }}
                    />
                    <Stack.Screen
                      name="login"
                      options={{ title: 'Login', gestureEnabled: false }}
                    />
                    <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
                  </Stack>
                  <SendFeedbackButton />
                  <UpdateChecker />
                  {survey && (
                    <SurveyModal
                      surveyName={survey.name}
                      questions={survey.questions}
                      isVisible={isSurveyVisible}
                      onClose={handleCloseSurvey}
                    />
                  )}
                </GestureHandlerRootView>
              </AppDataProvider>
            </ThemeWrapper>
            <Toast topOffset={55} config={toastConfig} />
            <PrivyElements />
          </AuthProvider>
        </PrivyProvider>
      </PostHogSurveyProvider>
    </PostHogProvider>
  );
};

export default Layout;
