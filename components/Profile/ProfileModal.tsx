import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
import { Container } from '../Container';
import { useAppData } from '../Wrappers/AppData';

import { Button } from '../Button';
import { FText } from '../Text/FText';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';

export const ProfileModal = () => {
  const [isExpanded, setisExpanded] = useState(false);
  const toggleModal = () => setisExpanded(!isExpanded);
  const router = useRouter();
  const { privy, user } = useAppData();
  const truncatedAddress =
    privy.wallet?.account?.address.slice(0, 6) + '...' + privy.wallet?.account?.address.slice(-4);
  const copyToClipboard = async (text?: string) => {
    if (!text) return;
    await Clipboard.setStringAsync(text);
    console.log('Copied to clipboard:', text);
  };

  if (!user.ens) {
    return (
      <View className="w-full">
        <Container title="" className="w-full">
          <FText className="text-center text-text">You don't have an ENS!</FText>
          <FText className="text-center text-text">{truncatedAddress}</FText>
        </Container>
      </View>
    );
  } else {
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
              <Container title="Your Profile" className="rounded-lg bg-content p-4">
                <TouchableOpacity onPress={() => copyToClipboard(`${user.ens}.fdmntl.eth`)}>
                  <FText className="text-center text-text">
                    @{user.ens} | {user.ens}.fdmntl.eth
                  </FText>
                </TouchableOpacity>
                <View className=" flex w-fit items-center justify-center rounded-xl bg-white p-4">
                  <QRCode value={user.wallet_address} size={280} />
                </View>
                <TouchableOpacity onPress={() => copyToClipboard(user.wallet_address)}>
                  <FText className=" text-center text-text">{truncatedAddress}</FText>
                </TouchableOpacity>
              </Container>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
};
