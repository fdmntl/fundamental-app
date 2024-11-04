import '../global.css';

import { PrivyProvider } from '@privy-io/expo';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CustomDrawerContent from '~/components/CustomDrawerContent';
import { ThemeWrapper } from '~/components/Wrappers/ThemeWrapper';
import { ConfigProvider } from '~/components/configContext';

const Layout = () => {
  return (
    <PrivyProvider appId="clxd5oc5m007jrpv8y8clt6z7">
      <ThemeWrapper>
        <ConfigProvider>
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
            </Drawer>
          </GestureHandlerRootView>
        </ConfigProvider>
      </ThemeWrapper>
    </PrivyProvider>
  );
};

export default Layout;

// Note: Keeping this for a while, we might need it later on (Stack navigation)
// import { Stack } from 'expo-router';
// return (
//   <PrivyProvider appId="clxd5oc5m007jrpv8y8clt6z7">
//     <ThemeWrapper>
//       <ConfigProvider>
//         <Stack>
//           <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//           <Stack.Screen name="+not-found" options={{ headerShown: true }} />
//           <Stack.Screen name="login" options={{ headerShown: false }} />
//         </Stack>
//       </ConfigProvider>
//     </ThemeWrapper>
//   </PrivyProvider>
// );
