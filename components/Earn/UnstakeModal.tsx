import { Feather } from '@expo/vector-icons';
import { View, Modal, TextInput, TouchableOpacity } from 'react-native';

import { Button } from '../Button';
import { useTheme } from '../Wrappers/ThemeWrapper';

import { FText } from '~/components/Text/FText';
import { EarnToken } from '~/types/earn';
import { convertAmount, formatTokenAmount } from '~/utils/earn.utils';

type UnstakeModalProps = {
  visible: boolean;
  token: EarnToken | null;
  amount: string;
  useUSD: boolean;
  onClose: () => void;
  onAmountChange: (amount: string) => void;
  onToggleCurrency: () => void;
  onConfirm: () => void;
  onMax: () => void;
};

export const UnstakeModal = ({
  visible,
  token,
  amount,
  useUSD,
  onClose,
  onAmountChange,
  onToggleCurrency,
  onConfirm,
  onMax,
}: UnstakeModalProps) => {
  const { theme } = useTheme();

  if (!token) return null;

  const { display, converted } = convertAmount(amount, token, useUSD);
  const numAmount = parseFloat(amount);
  const rewardAmount =
    !isNaN(numAmount) && amount
      ? ((numAmount * (useUSD ? 1 : token.last_value) * token.gains) / 100).toFixed(2)
      : '0.00';

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center bg-black/50 px-6">
        <View
          className={`gap-4 rounded-xl p-6 ${theme === 'dark' ? 'bg-background' : 'bg-content'}`}>
          <View className="flex-row items-center justify-between">
            <FText className="text-2xl" bold>
              Unstake {token.symbol}
            </FText>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} className="text-text" />
            </TouchableOpacity>
          </View>

          <View
            className={`gap-3 rounded-xl border-4 p-3 ${
              theme === 'dark' ? 'border-content' : 'border-background'
            }`}>
            <View className="flex-row justify-between">
              <FText className="text-neutral">Staked Balance</FText>
              <FText bold>
                {formatTokenAmount(token.staked, token)} {token.symbol}
              </FText>
            </View>
            <View
              className={`flex-row justify-between border-t-2 pt-3 ${
                theme === 'dark' ? 'border-content' : 'border-background'
              }`}>
              <FText className="text-neutral">Total Earnings</FText>
              <FText className="text-success" bold>
                +{token.gains.toFixed(2)}% (${token.gainsValue.toFixed(2)})
              </FText>
            </View>
          </View>

          <View className="">
            <FText className="mb-2 text-neutral">Amount to Unstake</FText>
            <View
              className={`flex-row items-center rounded-xl border-4 ${
                theme === 'dark' ? 'border-content bg-background' : 'border-background bg-content'
              }`}>
              <TextInput
                value={amount}
                onChangeText={onAmountChange}
                placeholder="0.0"
                keyboardType="decimal-pad"
                className="flex-1 p-4 text-text"
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                onPress={onToggleCurrency}
                className={`rounded-lg px-4 py-2 ${
                  theme === 'dark' ? 'bg-content' : 'bg-background'
                }`}>
                <FText bold>{useUSD ? 'USD' : token.symbol}</FText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onMax}
                className={`ml-2 mr-2 rounded-lg px-4 py-2 ${
                  theme === 'dark' ? 'bg-content' : 'bg-background'
                }`}>
                <FText bold>Max</FText>
              </TouchableOpacity>
            </View>
            {converted && <FText className="mt-1 text-sm text-neutral">{converted}</FText>}
          </View>

          {amount && display && (
            <View>
              <FText className="mb-2 text-lg" bold>
                Confirmation
              </FText>
              <View
                className={`gap-2 rounded-xl border-[3px] border-dashed p-4 ${
                  theme === 'dark' ? 'border-content' : 'border-background'
                }`}>
                <View className="flex-row justify-between">
                  <FText className="text-neutral">You will receive</FText>
                  <FText bold>{display}</FText>
                </View>
                <View className="flex-row justify-between">
                  <FText className="text-neutral">Including rewards</FText>
                  <FText className="text-success" bold>
                    +${rewardAmount}
                  </FText>
                </View>
              </View>
            </View>
          )}

          <View className="flex-row items-center justify-around">
            <Button
              icon={<Feather name="x" size={40} className="text-error" />}
              onPress={onClose}
              disableGradient
            />
            <Button
              icon={<Feather name="check" size={40} className="text-success" />}
              onPress={onConfirm}
              disableGradient
              disabled={!amount || parseFloat(amount) === 0}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
