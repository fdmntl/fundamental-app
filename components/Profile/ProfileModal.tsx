import { useState } from 'react';
import { View } from 'react-native';

import { ProfileDetailModal } from './ProfileDetailModal';
import { ProfilePreview } from './ProfilePreview';

export const ProfileModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => setIsModalVisible((prev) => !prev);

  return (
    <View>
      <ProfilePreview onPress={toggleModal} />
      <ProfileDetailModal visible={isModalVisible} onClose={toggleModal} />
    </View>
  );
};
