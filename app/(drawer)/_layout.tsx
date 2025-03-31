import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import CustomDrawerContent from '~/components/CustomDrawerContent';
import { useTheme } from '~/components/Wrappers/ThemeWrapper';

export default function DrawerLayout() {
  const { theme } = useTheme();
  return (
    <GestureHandlerRootView className="flex-1">
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          headerShown: false,
          drawerLabelStyle: {
            color: theme === 'dark' ? '#fff' : '#000',
            fontSize: 25,
            fontFamily: 'DMSans_700Bold',
          },
        }}>
        <Drawer.Screen
          name="(tabs)"
          options={{ drawerLabel: 'Home', drawerItemStyle: { display: 'none' } }}
        />
        <Drawer.Screen name="settings" options={{ drawerLabel: 'Settings' }} />
        <Drawer.Screen name="profile" options={{ drawerLabel: 'Profile' }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
