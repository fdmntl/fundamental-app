import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
import { Container } from '../Container';
import { useAppData } from '../Wrappers/AppData';

import { Button } from '../Button';
import { FText } from '../Text/FText';
import QRCode from 'react-native-qrcode-svg';

export const ProfileModal = () => {
  const [isExpanded, setisExpanded] = useState(false);
  const toggleModal = () => setisExpanded(!isExpanded);
  const router = useRouter();
  const { privy, user } = useAppData();
  const truncatedAddress =
    privy.wallet?.account?.address.slice(0, 6) + '...' + privy.wallet?.account?.address.slice(-4);
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
          <View className="flex-1 items-center justify-center bg-[rgba(0,0,0,0.5)]">
            <Container title="Your Profile" className="w-11/12 rounded-lg bg-content p-4">
              <TouchableOpacity>
                <FText className="text-center text-text">
                  @{user.ens} | {user.ens}.fdmntl.eth
                </FText>
              </TouchableOpacity>
              <View className="mt-8 flex items-center justify-center">
                <QRCode value={user.wallet_address} size={200} />
              </View>
              <TouchableOpacity>
                <FText className="mt-2 text-center text-text">{truncatedAddress}</FText>
              </TouchableOpacity>
            </Container>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
