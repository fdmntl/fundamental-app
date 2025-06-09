import { Feather } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { View, TouchableOpacity } from 'react-native';

import { FTitle } from './Text/FTitle';

interface HeaderBarProps {
  title: string;
  onInfoPress?: () => void;
}

export const HeaderBar = ({ title, onInfoPress }: HeaderBarProps): JSX.Element => {
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View className="flex flex-col">
      <View className="z-10 h-[6rem] flex-row items-center gap-2 py-4">
        <TouchableOpacity onPress={openDrawer}>
          <Feather name="menu" size={36} className="text-text" />
        </TouchableOpacity>
        <FTitle className="mt-1 text-4xl text-text">{title}</FTitle>
        {onInfoPress && (
          <TouchableOpacity onPress={onInfoPress} className="ml-auto">
            <Feather name="info" size={36} className="text-text" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
