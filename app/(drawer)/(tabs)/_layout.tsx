import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { cssInterop } from 'nativewind';
import { View, Platform } from 'react-native';

import { useTheme } from '~/components/Wrappers/ThemeWrapper';

cssInterop(Feather, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: 'color' },
  },
});

cssInterop(FontAwesome6, {
  className: {
    target: 'style',
    nativeStyleToProp: { color: 'color' },
  },
});

export default function Layout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 80,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme === 'dark' ? 'rgba(38, 35, 43, 1)' : 'rgba(243, 243, 248, 1)',
          borderTopWidth: 0,
          paddingVertical: Platform.OS === 'ios' ? 10 : 0,
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: theme === 'dark' ? 0.4 : 0.2,
          shadowRadius: 10,
          elevation: theme === 'dark' ? 10 : 8,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View className="items-center">
              <Feather
                size={28}
                name="home"
                className={`${focused ? 'text-primary' : 'text-text'}`}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="trade"
        options={{
          title: 'Trade',
          tabBarIcon: ({ focused }) => (
            <View className="items-center">
              <Feather
                size={28}
                name="repeat"
                className={`${focused ? 'text-primary' : 'text-text'}`}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="send"
        options={{
          title: 'Send',
          tabBarIcon: ({ focused }) => (
            <View className="items-center">
              <Feather
                size={28}
                name="send"
                className={`${focused ? 'text-primary' : 'text-text'}`}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
