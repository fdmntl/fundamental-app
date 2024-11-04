import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View } from 'react-native';

import FTitle from './Text/FTitle';
import ThemeToggle from './ThemeToggle';

export default function CustomDrawerContent(props: any) {
  return (
    <View className="flex-1 bg-primary">
      <DrawerContentScrollView {...props} scrollEnabled={false}>
        <FTitle className="p-5 text-4xl text-white">Fundamental</FTitle>
        <DrawerItemList {...props} />
        <View className="p-5">
          <ThemeToggle />
        </View>
      </DrawerContentScrollView>
    </View>
  );
}
