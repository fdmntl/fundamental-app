import React from 'react';
import { Linking, Modal, Pressable, View } from 'react-native';
import Constants from 'expo-constants';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { FText } from '../Text/FText';
interface UpdateModalProps {
  visible: boolean;
  versionName: string;
  updateUrl: string;
  currentVersionName: string;
  onClose: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  visible,
  versionName,
  updateUrl,
  currentVersionName,
  onClose,
}) => {
  if (Constants.expoConfig?.extra?.ignoreUpdates) {
    return null;
  }

  const handleUpdate = () => {
    if (updateUrl) {
      Linking.openURL(updateUrl);
    }
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/90">
        <Container>
          <View className="items-center gap-y-4">
            <FText className="text-center text-text">
              A new version ({currentVersionName} → {versionName}) is available!
            </FText>
            <FText className="text-center">
              Please update to get the latest features and improvements.
            </FText>
            <Button title="Update Now" onPress={handleUpdate} className="w-full bg-primary" />
            <Pressable onPress={onClose}>
              <FText className="text-center font-semibold">Later</FText>
            </Pressable>
          </View>
        </Container>
      </View>
    </Modal>
  );
};
