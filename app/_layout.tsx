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
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CustomDrawerContent from '~/components/CustomDrawerContent';
import { AppDataProvider } from '~/components/Wrappers/AppData';
import { ThemeWrapper } from '~/components/Wrappers/ThemeWrapper';

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
    <PrivyProvider appId="clxd5oc5m007jrpv8y8clt6z7">
      <ThemeWrapper>
        <AppDataProvider>
          <GestureHandlerRootView className="flex-1">
            <Drawer
              drawerContent={CustomDrawerContent}
              screenOptions={{
                drawerLabelStyle: {
                  color: 'white',
                  fontSize: 20,
                  fontFamily: 'DMSans_700Bold',
                },
              }}>
              <Drawer.Screen name="settings" options={{ headerShown: false, title: 'Settings' }} />
              <Drawer.Screen name="profile" options={{ headerShown: false, title: 'Profile' }} />
              <Drawer.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                  drawerItemStyle: { display: 'none' },
                }}
              />
              <Drawer.Screen
                name="login"
                options={{
                  headerShown: false,
                  drawerItemStyle: { display: 'none' },
                }}
              />
              <Drawer.Screen
                name="+not-found"
                options={{
                  headerShown: false,
                  drawerItemStyle: { display: 'none' },
                }}
              />
              <Drawer.Screen
                name="details"
                options={{
                  headerShown: false,
                  drawerItemStyle: { display: 'none' },
                }}
              />
              <Drawer.Screen
                name="assets/[asset]"
                options={{
                  headerShown: false,
                  drawerItemStyle: { display: 'none' },
                }}
              />
              <Drawer.Screen
                name="send/[address]"
                options={{
                  headerShown: false,
                  drawerItemStyle: { display: 'none' },
                }}
              />
            </Drawer>
          </GestureHandlerRootView>
        </AppDataProvider>
      </ThemeWrapper>
      <PrivyElements />
    </PrivyProvider>
  );
};

export default Layout;

// Note: Keeping this for a while, we might need it later on (Stack navigation)
// import { Stack } from 'expo-router';
// return (
//   <PrivyProvider appId="clxd5oc5m007jrpv8y8clt6z7">
//     <ThemeWrapper>
//       <AppDataProvider>
//         <Stack>
//           <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//           <Stack.Screen name="+not-found" options={{ headerShown: true }} />
//           <Stack.Screen name="login" options={{ headerShown: false }} />
//         </Stack>
//       </AppDataProvider>
//     </ThemeWrapper>
//   </PrivyProvider>
// );
