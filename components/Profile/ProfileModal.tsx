import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { Container } from '../Container';
import { FText } from '../Text/FText';
import { FTitle } from '../Text/FTitle';
import { useAppData } from '../Wrappers/AppData';

import { copyToClipboard } from '~/utils/helpers/copyToClipboard';
import { trimAddress } from '~/utils/helpers/strings/trimAddress';

export const ProfileModal = () => {
  const [isExpanded, setisExpanded] = useState(false);
  const toggleModal = () => setisExpanded(!isExpanded);
  const { privy, user } = useAppData();
  const truncatedAddress = trimAddress(privy.wallet?.account?.address || '');

  if (!user.ens) {
    return (
      <View>
        <Container>
          <FText className="text-center">You don't have an ENS!</FText>
          <FText className="text-center">{truncatedAddress}</FText>
        </Container>
      </View>
    );
  } else {
    return (
      <View>
        <TouchableOpacity onPress={toggleModal} className="w-full rounded p-2 shadow-sm">
          <Container>
            <View className="flex flex-row gap-4">
              <Feather name="user" size={48} className="text-text" />
              <View className="flex flex-col justify-center">
                <FText className="!text-2xl" bold>
                  @{user.ens}
                </FText>
                <FText italic>{user.ens}.fdmntl.eth</FText>
              </View>
            </View>
          </Container>
        </TouchableOpacity>
        <Modal visible={isExpanded} animationType="fade" transparent onRequestClose={toggleModal}>
          <TouchableWithoutFeedback onPress={toggleModal}>
            <View className="flex-1 items-center justify-center bg-[rgba(0,0,0,0.5)]">
              <Container className="rounded-lg bg-content px-2">
                <View className="gap-5">
                  <View className="gap-1">
                    <FText className="!text-3xl" bold>
                      @{user.ens}
                    </FText>
                    <TouchableOpacity onPress={() => copyToClipboard(`${user.ens}.fdmntl.eth`)}>
                      <View className="flex flex-row items-center gap-2">
                        <FText italic>{user.ens}.fdmntl.eth</FText>
                        <Feather name="copy" size={14} className="text-text" />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View className="items-center justify-center self-center rounded-xl bg-white p-3">
                    <QRCode value={user.wallet_address} size={200} />
                  </View>
                  <TouchableOpacity
                    onPress={() => copyToClipboard(user.wallet_address)}
                    className="w-auto flex-row items-center justify-center gap-2">
                    <FText className="!text-2xl !text-neutral">{truncatedAddress}</FText>
                    <Feather name="copy" size={18} className="text-text" />
                  </TouchableOpacity>
                  <View className="flex items-center justify-center">
                    <FTitle className="!text-2xl !text-neutral">Fundamental</FTitle>
                  </View>
                </View>
              </Container>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
};
