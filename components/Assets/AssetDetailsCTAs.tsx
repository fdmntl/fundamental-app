import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';

import { Button } from '../Button';
import { FText } from '../Text/FText';

export const AssetDetailsCTAs = () => {
  const [isTransferModalVisible, setisTransferModalVisible] = useState(false);
  const toggleModal = () => setisTransferModalVisible(!isTransferModalVisible);

  return (
    <View className="absolute bottom-0 w-full items-center">
      <Button title="Transfer" className="w-1/2" onPress={toggleModal} />
      <Modal
        transparent
        visible={isTransferModalVisible}
        animationType="fade"
        onRequestClose={toggleModal}>
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View className="flex-1 justify-end bg-[rgba(0,0,0,0.5)]">
            <TouchableWithoutFeedback>
              <View className="flex gap-y-8 rounded-t-3xl bg-content p-6 pb-10">
                <TouchableOpacity
                  className="flex-row items-center gap-x-2"
                  onPress={() => {
                    console.log('Send pressed');
                  }}>
                  <Feather name="arrow-up" size={30} className="text-text" />
                  <FText className="!text-2xl" bold>
                    Send
                  </FText>
                  <FText className="text-neutral-500">To another wallet address</FText>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-row items-center gap-x-2"
                  onPress={() => {
                    console.log('Receive pressed');
                  }}>
                  <Feather name="arrow-down" size={30} className="text-text" />
                  <FText className="!text-2xl" bold>
                    Receive
                  </FText>
                  <FText className="text-neutral-500">From another wallet</FText>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
