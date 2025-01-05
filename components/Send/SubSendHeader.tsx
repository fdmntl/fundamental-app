import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { FTitle } from '../Text/FTitle';

interface SubSendHeaderProps {
  title: string;
  address: string;
}

export const SubSendHeader = ({ title, address }: SubSendHeaderProps) => {
  return (
    <View className="h-50 z-10 flex-row items-center gap-2 py-4">
      <TouchableOpacity onPress={() => router.push(`/assets/${address}`)}>
        {/* Navigate back */}
        <Feather name="chevron-left" size={42} className="-ml-2 text-text" />
      </TouchableOpacity>
      <FTitle className="mt-2 text-4xl text-text">{title}</FTitle>
    </View>
  );
};
