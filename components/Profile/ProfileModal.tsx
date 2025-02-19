import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
import { Container } from '../Container';
import { useAppData } from '../Wrappers/AppData';

import { Button } from '../Button';
import { FText } from '../Text/FText';

export const ProfileModal = () => {
  const [isExpanded, setisExpanded] = useState(false);
  const toggleModal = () => setisExpanded(!isExpanded);
  const router = useRouter();
  const { privy, user } = useAppData();

  return (
    <View className="w-full">
      <TouchableOpacity onPress={toggleModal} className="w-full rounded p-2">
        <Container title="" className="w-full">
          <FText className="text-center text-text">@{user.ens}</FText>
          <FText className="text-center text-text">{user.ens}.fdmntl.eth</FText>
        </Container>
      </TouchableOpacity>
      <Modal visible={isExpanded} animationType="fade" transparent onRequestClose={toggleModal}>
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View className="flex-1 items-center justify-center bg-[rgba(0,0,0,0.7)]">
            <View className="w-4/5 items-center rounded-lg bg-[rgba(0,0,0,0.9)] p-5">
              <FText className="text-lg font-bold text-white">FULL VIEW</FText>
              <TouchableOpacity onPress={toggleModal} className="mt-4 rounded bg-red-500 p-2">
                <FText className="text-white">Close</FText>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
