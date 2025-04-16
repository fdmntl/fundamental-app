import { OrderParameters } from '@cowprotocol/cow-sdk';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Modal, View, TouchableWithoutFeedback, Image } from 'react-native';

import { FText } from '~/components/Text/FText';
import { FTitle } from '~/components/Text/FTitle';
import { Token } from '~/types/supabaseTypes';
import { tokenIcons } from '~/utils/helpers/mappings/tokenIcons';

interface ConfirmTradeModalProps {
  isModalOpen: boolean;
  toggleModal: () => void;
  onConfirm: () => void;
  quote: OrderParameters | null;
  selectedPayToken: Token | null;
  selectedGetToken: Token | null;
}

export const ConfirmTradeModal = ({
  isModalOpen,
  toggleModal,
  onConfirm,
  quote,
  selectedPayToken,
  selectedGetToken,
}: ConfirmTradeModalProps) => {
  return (
    <Modal visible={isModalOpen} animationType="fade" transparent onRequestClose={toggleModal}>
      <TouchableWithoutFeedback onPress={toggleModal}>
        <View className="flex-1 items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <View className="w-full max-w-md gap-5 rounded-2xl bg-background p-4">
            <FTitle className="!text-3xl">Confirm Trade</FTitle>
            <View className="gap-2">
              <View className="rounded-t-2xl bg-content px-3 py-2">
                <FText className="!text-2xl !text-neutral" bold>
                  You will pay
                </FText>
                <View className="flex-row items-center gap-2 p-2">
                  <Image
                    source={tokenIcons[selectedPayToken?.symbol ?? 'default']}
                    className="h-12 w-12"
                  />
                  <View className="flex-col">
                    <FText className="!text-2xl" bold>
                      {quote?.sellAmount} {selectedPayToken?.symbol}
                    </FText>
                    <FText className="!text-neutral" bold>
                      ≈${quote?.sellAmount}
                    </FText>
                  </View>
                </View>
              </View>
              <View className="rounded-b-2xl bg-content px-3 py-2">
                <FText className="!text-2xl !text-neutral" bold>
                  You will receive
                </FText>
                <View className="flex-row items-center gap-2 p-2">
                  <Image
                    source={tokenIcons[selectedGetToken?.symbol ?? 'default']}
                    className="h-12 w-12"
                  />
                  <View className="flex-col">
                    <FText className="!text-2xl" bold>
                      {quote?.buyAmount} {selectedGetToken?.symbol}
                    </FText>
                    <FText className="!text-neutral" bold>
                      ≈${quote?.buyAmount}
                    </FText>
                  </View>
                </View>
              </View>
            </View>
            <View className="flex-row items-center justify-center gap-32">
              <Feather name="x" size={40} color="#f87171" onPress={toggleModal} />
              <Feather name="send" size={32} color="#4ade80" onPress={onConfirm} />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
