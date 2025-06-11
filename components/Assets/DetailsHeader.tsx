import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { View, Image, ImageSourcePropType } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { FTitle } from '../Text/FTitle';

interface DetailsHeaderProps {
  title: string;
  icon?: ImageSourcePropType;
}

export const DetailsHeader = ({ title, icon }: DetailsHeaderProps) => {
  return (
    <View className="h-50 z-10 flex-row items-center gap-2 py-4">
      <TouchableOpacity onPress={() => router.back()}>
        <Feather name="chevron-left" size={42} className="-ml-2 text-text" />
      </TouchableOpacity>
      <FTitle className="mt-2 text-4xl text-text">{title}</FTitle>
      {icon && (
        <View className="ml-auto mr-2">
          <Image source={icon} style={{ height: 50, width: 50 }} resizeMode="contain" />
        </View>
      )}
    </View>
  );
};
