import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { View, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { FTitle } from '../Text/FTitle';

const fundyLeft = require('assets/fundyLeft.png');

interface DetailsHeaderProps {
  title: string;
}

export const DetailsHeader = ({ title }: DetailsHeaderProps) => {
  return (
    <View className="h-50 z-10 flex-row items-center gap-2 py-4">
      <TouchableOpacity onPress={() => router.navigate('/assets')}>
        <Feather name="chevron-left" size={42} className="-ml-2 text-text" />
      </TouchableOpacity>
      <FTitle className="mt-2 text-4xl text-text">{title}</FTitle>
      <View className="ml-auto">
        <Image source={fundyLeft} style={{ height: 64, width: 96 }} resizeMode="contain" />
      </View>
    </View>
  );
};
