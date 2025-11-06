import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, View, TouchableWithoutFeedback, Image, TouchableOpacity } from 'react-native';

import { FText } from '../Text/FText';
import { FTitle } from '../Text/FTitle';
import { useTheme } from '../Wrappers/ThemeWrapper';

import { Token } from '~/types/supabaseTypes';

interface ConfirmSendModalProps {
  isModalOpen: boolean;
  toggleModal: () => void;
  onConfirm: () => void;
  recipient: string;
  amount: string;
  selectedToken: Token;
}

export const ConfirmSendModal = ({
  isModalOpen,
  toggleModal,
  onConfirm,
  recipient,
  amount,
  selectedToken,
}: ConfirmSendModalProps) => {
  const { theme } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Modal visible={isModalOpen} animationType="fade" transparent onRequestClose={toggleModal}>
      <TouchableWithoutFeedback onPress={toggleModal}>
        <View className="flex-1 items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <TouchableWithoutFeedback onPress={() => {}}>
            <View className="w-[85%] gap-2 rounded-2xl bg-background p-5">
              <FTitle className="text-3xl">Confirm Send</FTitle>
              <View className="gap-2">
                <View className="relative rounded-2xl bg-content p-3 pb-2">
                  <TouchableOpacity
                    className="absolute right-2 top-2 z-10"
                    onPress={() => setShowTooltip(!showTooltip)}>
                    <Feather name="info" size={18} color="#6b7280" />
                  </TouchableOpacity>
                  <View className="gap-2">
                    <Image
                      source={
                        theme === 'dark'
                          ? require('../../assets/base-logo-dark.png')
                          : require('../../assets/base-logo-light.png')
                      }
                      className="h-4 w-16"
                      resizeMode="contain"
                    />
                    <View>
                      <FText className="text-xl text-neutral" bold>
                        Trades are only supported on the Base network.
                      </FText>
                      {showTooltip && (
                        <View className="mt-2 rounded-lg bg-background p-2">
                          <FText className="text-sm text-neutral">
                            Do not send tokens from other blockchains (Arbitrum, Polygon, etc), they
                            will be lost and unrecoverable.
                          </FText>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
                <View className="flex-col">
                  <FText className="text-xl text-neutral" bold>
                    Amount:
                  </FText>
                  <FText className="text-2xl" bold>
                    {amount} {selectedToken.symbol}
                  </FText>
                </View>
                <View className="flex-col">
                  <FText className="text-xl text-neutral" bold>
                    Recipient:
                  </FText>
                  <FText className="text-2xl" bold>
                    {recipient}
                  </FText>
                </View>
              </View>
              <View className="flex-row items-center justify-center gap-32 pt-4">
                <Feather name="x" size={40} color="#f87171" onPress={toggleModal} />
                <Feather
                  name="check"
                  size={40}
                  color="#4ade80"
                  onPress={() => {
                    onConfirm();
                    toggleModal();
                  }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
