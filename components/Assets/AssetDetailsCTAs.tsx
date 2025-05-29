import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, TouchableOpacity, View, TouchableWithoutFeedback } from 'react-native';
import Toast from 'react-native-toast-message';

import { Button } from '../Button';
import { FText } from '../Text/FText';

interface ModalProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  tokenAddress?: string;
}

const TransferModal = ({ isModalVisible, toggleModal, tokenAddress }: ModalProps) => {
  const router = useRouter();

  return (
    <Modal transparent visible={isModalVisible} animationType="fade" onRequestClose={toggleModal}>
      <TouchableWithoutFeedback onPress={toggleModal}>
        <View className="flex-1 justify-end bg-[rgba(0,0,0,0.5)]">
          <TouchableWithoutFeedback>
            <View className="flex gap-y-8 rounded-t-3xl bg-content p-6 pb-10">
              <TouchableOpacity
                className="flex-row items-center gap-x-2"
                onPress={() => {
                  if (tokenAddress) {
                    toggleModal();
                    router.push(`/send/${tokenAddress}`);
                  } else {
                    console.log('Token address is undefined');
                    Toast.show({
                      type: 'error',
                      text1: 'Token address is not available.',
                    });
                  }
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
  );
};

const BuySellModal = ({ isModalVisible, toggleModal, tokenAddress }: ModalProps) => {
  const router = useRouter();

  return (
    <Modal transparent visible={isModalVisible} animationType="fade" onRequestClose={toggleModal}>
      <TouchableWithoutFeedback onPress={toggleModal}>
        <View className="flex-1 justify-end bg-[rgba(0,0,0,0.5)]">
          <TouchableWithoutFeedback>
            <View className="flex gap-y-8 rounded-t-3xl bg-content p-6 pb-10">
              <TouchableOpacity
                className="flex-row items-center gap-x-2"
                onPress={() => {
                  if (tokenAddress) {
                    toggleModal();
                    router.push({
                      pathname: '/trade',
                      params: {
                        prefillTokenAddress: tokenAddress,
                        method: 'buy',
                      },
                    });
                  } else {
                    console.log('Token address is undefined');
                    Toast.show({
                      type: 'error',
                      text1: 'Token address is not available.',
                    });
                  }
                }}>
                <Feather name="shopping-bag" size={30} className="text-text" />
                <FText className="!text-2xl" bold>
                  Buy
                </FText>
                <FText className="text-neutral-500">Add token to your wallet</FText>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-row items-center gap-x-2"
                onPress={() => {
                  if (tokenAddress) {
                    toggleModal();
                    router.push({
                      pathname: '/trade',
                      params: {
                        prefillTokenAddress: tokenAddress,
                        method: 'sell',
                      },
                    });
                  } else {
                    console.log('Token address is undefined');
                    Toast.show({
                      type: 'error',
                      text1: 'Token address is not available.',
                    });
                  }
                }}>
                <Feather name="dollar-sign" size={30} className="text-text" />
                <FText className="!text-2xl" bold>
                  Sell
                </FText>
                <FText className="text-neutral-500">Sell token from your wallet</FText>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export const AssetDetailsCTAs = ({ tokenAddress }: { tokenAddress: string }) => {
  const [isBuySellModalVisible, setisBuySellModalVisible] = useState(false);
  const [isTransferModalVisible, setisTransferModalVisible] = useState(false);
  const toggleBuySellModal = () => setisBuySellModalVisible(!isBuySellModalVisible);
  const toggleTransferModal = () => setisTransferModalVisible(!isTransferModalVisible);

  return (
    <View className="absolute bottom-0 left-0 w-full flex-row items-center gap-4 px-4">
      <Button title="Buy & Sell" className="flex-1" onPress={toggleBuySellModal} />
      <Button title="Transfer" className="flex-1" onPress={toggleTransferModal} />
      <TransferModal
        isModalVisible={isTransferModalVisible}
        toggleModal={toggleTransferModal}
        tokenAddress={tokenAddress}
      />
      <BuySellModal
        isModalVisible={isBuySellModalVisible}
        toggleModal={toggleBuySellModal}
        tokenAddress={tokenAddress}
      />
    </View>
  );
};
