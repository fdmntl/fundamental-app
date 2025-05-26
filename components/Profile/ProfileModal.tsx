import { useState } from 'react';
import { View } from 'react-native';

import { ProfileDetailModal } from './ProfileDetailModal';
import { ProfilePreview } from './ProfilePreview';

export const ProfileModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  return (
    <View>
      <ProfilePreview onPress={openModal} />
      <ProfileDetailModal visible={isModalVisible} onClose={closeModal} />
    </View>
  );
};
