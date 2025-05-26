import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Image } from 'react-native';

import { LogoutButton } from './LogoutButton';
import { ProfileModal } from './Profile/ProfileModal';
import ThemeToggle from './ThemeToggle';

export default function CustomDrawerContent(props: any) {
  return (
    <View className="flex-1 bg-background">
      <DrawerContentScrollView {...props} scrollEnabled={false} className="flex-1">
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
      <View className="p-8 pb-12">
        <LogoutButton />
      </View>
    </View>
  );
}
