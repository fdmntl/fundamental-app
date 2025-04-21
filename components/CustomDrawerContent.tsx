import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Image } from 'react-native';

import ThemeToggle from './ThemeToggle';

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
        <DrawerItemList {...props} />
        <View className="p-5">
          <ThemeToggle />
        </View>
      </DrawerContentScrollView>
    </View>
  );
}
