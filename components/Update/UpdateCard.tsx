import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Linking, Pressable, View } from 'react-native';

import { useAppData } from '~/components/Wrappers/AppData';
import { Container } from '../Container';
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

  return (
    <Container className="" useGradient>
      <Pressable onPress={handleUpdatePress}>
        <View className="flex-row items-center justify-between">
          <View className="">
            <FText className="">A new version is available!</FText>
            <FText className="" bold>
              Update from {updateInfo.currentVersionName} to {updateInfo.versionName}
            </FText>
          </View>
          <Feather name="download" size={28} className="text-text" />
        </View>
      </Pressable>
    </Container>
  );
};
