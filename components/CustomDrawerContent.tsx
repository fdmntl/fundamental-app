import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Image } from 'react-native';

import { ProfileModal } from './Profile/ProfileModal';
import ThemeToggle from './ThemeToggle';
import { LogoutButton } from './LogoutButton';

export default function CustomDrawerContent(props: any) {
  return (
    <View className="flex-1 bg-background">
      <DrawerContentScrollView {...props} scrollEnabled={false}>
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
        <LogoutButton />
      </DrawerContentScrollView>
    </View>
  );
}
