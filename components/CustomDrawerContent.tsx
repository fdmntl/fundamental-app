import { Feather } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

import { LogoutButton } from './LogoutButton';
import { OnboardingScreen } from './OnboardingSceen/OnboardingScreen';
import { ProfileModal } from './Profile/ProfileModal';
import ThemeToggle from './ThemeToggle';

export default function CustomDrawerContent(props: any) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const toggleOnbaording = () => {
    setShowOnboarding(!showOnboarding);
  };
  return (
    <View className="flex-1 bg-background">
      <DrawerContentScrollView {...props} scrollEnabled={false} className="flex-1">
        <OnboardingScreen visible={showOnboarding} onClose={() => setShowOnboarding(false)} />

        <View className="p-3">
          <Image
            source={require('../assets/fundamental-text.png')}
            style={{ height: 44, width: 250 }}
            resizeMode="contain"
          />
        </View>
        <View className="p-4">
          <ProfileModal />
        </View>
        <DrawerItemList {...props} />
        <View className="p-5">
          <ThemeToggle />
        </View>
      </DrawerContentScrollView>
      <View className="flex flex-row justify-between p-8 pb-12">
        <LogoutButton />
        <TouchableOpacity onPress={toggleOnbaording}>
          <Feather name="book-open" size={42} className="text-text" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
