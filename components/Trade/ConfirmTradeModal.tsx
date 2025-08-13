import { OrderParameters } from '@cowprotocol/cow-sdk';
import { Feather } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import {
  Animated,
  Easing,
  Modal,
  View,
  TouchableWithoutFeedback,
  Image,
  LayoutAnimation,
} from 'react-native';

import { useAppData } from '../Wrappers/AppData';

import { FText } from '~/components/Text/FText';
import { FTitle } from '~/components/Text/FTitle';
import { Token } from '~/types/supabaseTypes';
import { tokenIcons } from '~/utils/helpers/mappings/tokenIcons';
import { digitsToAmount } from '~/utils/helpers/tokens/digitsToAmount';
import { getTokenAmountPrice } from '~/utils/helpers/tokens/getTokenAmountPrice';
import { printToken } from '~/utils/helpers/tokens/printToken';

interface ConfirmTradeModalProps {
  isModalOpen: boolean;
  toggleModal: () => void;
  onConfirm: () => void;
  onClearAmount?: () => void;
  onClearQuote?: () => void;
  quote: OrderParameters;
  selectedPayToken: Token;
  selectedGetToken: Token;
}

export const ConfirmTradeModal = ({
  isModalOpen,
  toggleModal,
  onConfirm,
  onClearAmount,
  onClearQuote,
  quote,
  selectedPayToken,
  selectedGetToken,
}: ConfirmTradeModalProps) => {
  const { tokens } = useAppData();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsDropdownOpen((prev) => !prev);
  };

  const dropdownAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(dropdownAnim, {
      toValue: isDropdownOpen ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isDropdownOpen]);

  const CoWFee = quote.feeAmount;
  const gasFee = 0;
  const fundamentalFee = 0;
  // TODO: Add gas fee and fundamental fee calculation
  const totalFee = CoWFee;

  return (
    <Modal visible={isModalOpen} animationType="fade" transparent onRequestClose={toggleModal}>
      <TouchableWithoutFeedback onPress={toggleModal}>
        <View className="flex-1 items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <View className="w-full max-w-md gap-5 rounded-2xl bg-background p-5">
            <FTitle className="text-3xl">Confirm Trade</FTitle>
            <View className="gap-2">
              <View className="rounded-t-2xl bg-content px-3 py-2">
                <FText className="text-2xl text-neutral" bold>
                  You will pay
                </FText>
                <View className="flex-row items-center gap-2 p-2">
                  <Image
                    source={tokenIcons[selectedPayToken.symbol ?? 'default']}
                    className="h-12 w-12"
                  />
                  <View className="flex-col">
                    <FText className="text-2xl" bold>
                      {printToken(
                        digitsToAmount(Number(quote.sellAmount), selectedPayToken!) +
                          digitsToAmount(Number(quote.feeAmount), selectedPayToken!),
                        selectedPayToken!
                      )}{' '}
                      {selectedPayToken.symbol}
                    </FText>
                    <FText className="text-neutral" bold>
                      ≈$
                      {printToken(
                        getTokenAmountPrice(
                          selectedPayToken.address || '',
                          digitsToAmount(Number(quote.sellAmount), selectedPayToken!) +
                            digitsToAmount(Number(quote.feeAmount), selectedPayToken!),
                          tokens
                        ),
                        selectedPayToken!
                      )}
                    </FText>
                  </View>
                </View>
              </View>
              <View className="rounded-b-2xl bg-content px-3 py-2">
                <FText className="text-2xl text-neutral" bold>
                  You will receive
                </FText>
                <View className="flex-row items-center gap-2 p-2">
                  <Image
                    source={tokenIcons[selectedGetToken.symbol ?? 'default']}
                    className="h-12 w-12"
                  />
                  <View className="flex-col">
                    <FText className="text-2xl" bold>
                      {printToken(
                        digitsToAmount(Number(quote.buyAmount), selectedGetToken!),
                        selectedGetToken!
                      )}{' '}
                      {selectedGetToken.symbol}
                    </FText>
                    <FText className="text-neutral" bold>
                      ≈$
                      {getTokenAmountPrice(
                        selectedGetToken.address || '',
                        digitsToAmount(Number(quote.buyAmount), selectedGetToken!),
                        tokens
                      ).toFixed(2)}
                    </FText>
                  </View>
                </View>
              </View>
            </View>
            <View>
              <View className="flex-row items-center gap-2">
                <Feather name="compass" size={24} color="#7CA7FF" />
                <View className="flex-row items-center gap-1">
                  <FText className="text-xl text-neutral" bold>
                    Fees:
                  </FText>
                  <FText className="text-xl" bold>
                    {digitsToAmount(Number(totalFee), selectedPayToken)} {selectedPayToken.symbol}
                  </FText>
                </View>
                <Feather
                  name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color="#7CA7FF"
                  onPress={toggleDropdown}
                  className="ml-auto"
                />
              </View>
              {isDropdownOpen && (
                <View className="mt-4 rounded-xl border border-dashed border-neutral p-2">
                  <View className="flex-row items-center justify-between">
                    <FText className="text-lg text-neutral" bold>
                      CoW Fee:
                    </FText>
                    <FText className="text-lg" bold>
                      {digitsToAmount(Number(CoWFee), selectedPayToken)} {selectedPayToken.symbol}
                    </FText>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <FText className="text-lg text-neutral" bold>
                      Gas Fee:
                    </FText>
                    <FText className="text-lg" bold>
                      {gasFee} {selectedPayToken.symbol}
                    </FText>
                  </View>
                  <View className="flex-row items-center justify-between">
                    <FText className="text-lg text-neutral" bold>
                      Fundamental Fee:
                    </FText>
                    <FText className="text-lg" bold>
                      {fundamentalFee} {selectedPayToken.symbol}
                    </FText>
                  </View>
                </View>
              )}
            </View>
            <View className="flex-row items-center justify-center gap-32">
              <Feather name="x" size={40} color="#f87171" onPress={toggleModal} />
              <Feather
                name="check"
                size={40}
                color="#4ade80"
                onPress={() => {
                  onClearAmount?.();
                  onClearQuote?.();
                  onConfirm();
                  toggleModal();
                }}
              />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
