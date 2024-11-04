import { Feather } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { View, Image, TouchableOpacity } from 'react-native';

import Title from './Text/FTitle';

const fundy = require('../assets/fundy.png');

const TitleBar = ({ title }: { title: string }) => {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View className="h-50 z-10 flex-row items-center gap-2 py-4">
      <TouchableOpacity onPress={openDrawer}>
        <Feather name="menu" size={36} className="text-text" />
      </TouchableOpacity>
      <Title className="mt-2 text-4xl text-text">{title}</Title>
      <Image
        source={fundy}
        style={{ marginLeft: 'auto', height: 64, width: 96 }}
        resizeMode="contain"
      />
    </View>
  );
};

export default TitleBar;
