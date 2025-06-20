import React from 'react';
import { Linking, Modal, Pressable, View } from 'react-native';

import { Button } from '~/components/Button';
import { Container } from '~/components/Container';
import { FText } from '../Text/FText';

interface UpdateModalProps {
  visible: boolean;
  versionName: string;
  updateUrl: string;
  currentVersionName: string;
  currentBuildNumber: number;
  latestBuildNumber: number;
  onClose: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  visible,
  versionName,
  updateUrl,
  currentVersionName,
  currentBuildNumber,
  latestBuildNumber,
  onClose,
}) => {
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
          <View className="items-center gap-y-4 p-6">
            <FText className="text-center text-2xl font-bold text-text">Update Available</FText>
            <FText className="text-text/80 text-center">
              Your version: {currentVersionName} (build {currentBuildNumber}){'\n'}
              Latest version: {versionName} (build {latestBuildNumber})
            </FText>
            <View className="w-full flex-col items-center gap-y-2 pt-2">
              <Button title="Update Now" onPress={handleUpdate} className="w-full bg-primary" />
              <Pressable onPress={onClose} className="p-2">
                <FText className="text-text/70 text-center font-semibold">Later</FText>
              </Pressable>
            </View>
          </View>
        </Container>
      </View>
    </Modal>
  );
};
