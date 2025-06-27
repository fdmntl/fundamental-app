import { Feather } from '@expo/vector-icons';
import { Modal, View, TouchableWithoutFeedback } from 'react-native';

import { FText } from '../Text/FText';
import { FTitle } from '../Text/FTitle';

import { Token } from '~/types/supabaseTypes';

interface ConfirmSendModalProps {
  isModalOpen: boolean;
  toggleModal: () => void;
  onConfirm: () => void;
  onClearRecipient?: () => void;
  onClearAmount?: () => void;
  recipient: string;
  amount: string;
  selectedToken: Token;
}

export const ConfirmSendModal = ({
  isModalOpen,
  toggleModal,
  onConfirm,
  onClearRecipient,
  onClearAmount,
  recipient,
  amount,
  selectedToken,
}: ConfirmSendModalProps) => (
  <Modal visible={isModalOpen} animationType="fade" transparent onRequestClose={toggleModal}>
    <TouchableWithoutFeedback onPress={toggleModal}>
      <View className="flex-1 items-center justify-center bg-[rgba(0,0,0,0.5)]">
        <TouchableWithoutFeedback onPress={() => {}}>
          <View className="w-[85%] gap-2 rounded-2xl bg-background p-5">
            <FTitle className="!text-3xl">Confirm Send</FTitle>
            <View className="gap-2">
              <View className="rounded-2xl bg-content p-2 px-3">
                <FText className="!text-xl !text-neutral" bold>
                  You are about to send funds to another wallet
                </FText>
              </View>
              <View className="flex-col">
                <FText className="!text-xl !text-neutral" bold>
                  Amount:
                </FText>
                <FText className="!text-2xl" bold>
                  {amount} {selectedToken.symbol}
                </FText>
              </View>
              <View className="flex-col">
                <FText className="!text-xl !text-neutral" bold>
                  Recipient:
                </FText>
                <FText className="!text-2xl" bold>
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
                  onClearRecipient?.();
                  onClearAmount?.();
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
