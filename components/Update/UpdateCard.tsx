import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Linking, Pressable, StyleSheet, View } from 'react-native';

import { useAppData } from '~/components/Wrappers/AppData';
import { FText } from '../Text/FText';

export const UpdateCard = () => {
  const { updateInfo } = useAppData();

  if (!updateInfo) {
    return null;
  }

  const handleUpdatePress = () => {
    if (updateInfo.updateUrl) {
      Linking.openURL(updateInfo.updateUrl);
    }
  };

  const gradientColors = ['#741AD9', '#8720FE', '#A250F5'];

  return (
    <View className="overflow-hidden rounded-xl">
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <Pressable onPress={handleUpdatePress} className="p-4">
        <View className="flex-row items-center justify-between">
          <View>
            <FText className="text-white">A new version is available!</FText>
            <FText className="text-white" bold>
              Update from {updateInfo.currentVersionName} to {updateInfo.versionName}
            </FText>
          </View>
          <Feather name="download" size={28} className="text-white" />
        </View>
      </Pressable>
    </View>
  );
};
