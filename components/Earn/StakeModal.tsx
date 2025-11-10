import { Feather } from '@expo/vector-icons';
import { View, Modal, TextInput, TouchableOpacity } from 'react-native';
import { FText } from '~/components/Text/FText';
import { EarnToken } from '~/types/earn';
import { convertAmount, calculateEstimatedYearlyEarnings, formatTokenAmount } from '~/utils/earn.utils';

type StakeModalProps = {
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

export const StakeModal = ({
  visible,
  token,
  amount,
  useUSD,
  onClose,
  onAmountChange,
  onToggleCurrency,
  onConfirm,
  onMax,
}: StakeModalProps) => {
  if (!token) return null;

  const { display, converted } = convertAmount(amount, token, useUSD);
  const estimatedEarnings = calculateEstimatedYearlyEarnings(amount, token, useUSD);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end bg-black/50">
        <View className="rounded-t-3xl bg-background p-6">
          <View className="mb-6 flex-row items-center justify-between">
            <FText className="text-2xl" bold>Stake {token.symbol}</FText>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} />
            </TouchableOpacity>
          </View>

          {/* Informations */}
          <View className="mb-6 gap-3 rounded-xl bg-primary/10 p-4">
            <View className="flex-row justify-between">
              <FText className="text-neutral">APY</FText>
              <FText className="text-success" bold>{token.apy.toFixed(1)}%</FText>
            </View>
            <View className="flex-row justify-between">
              <FText className="text-neutral">Available Balance</FText>
              <FText bold>
                {formatTokenAmount(token.balance, token)} {token.symbol}
              </FText>
            </View>
            <View className="flex-row justify-between">
              <FText className="text-neutral">Current Price</FText>
              <FText bold>${token.last_value.toFixed(2)}</FText>
            </View>
            {token.is_stablecoin && (
              <View className="mt-2 rounded-lg bg-success/10 p-2">
                <FText className="text-xs text-success">🟢 Stablecoin - Lower risk</FText>
              </View>
            )}
          </View>

          {/* Input avec switch USD */}
          <View className="mb-2">
            <FText className="mb-2 text-neutral">Amount to Stake</FText>
            <View className="flex-row items-center rounded-xl border border-neutral/20 bg-background">
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
                className="mr-4 rounded-lg bg-primary/20 px-3 py-2">
                <FText className="text-primary" bold>{useUSD ? 'USD' : token.symbol}</FText>
              </TouchableOpacity>
            </View>
            {converted && (
              <FText className="mt-1 text-sm text-neutral">{converted}</FText>
            )}
          </View>

          {/* Bouton Max */}
          <TouchableOpacity onPress={onMax} className="mb-6 self-end">
            <FText className="text-primary" bold>Use Max</FText>
          </TouchableOpacity>

          {/* Résumé */}
          {amount && display && (
            <View className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
              <FText className="mb-2 text-lg" bold>Confirmation</FText>
              <View className="gap-2">
                <View className="flex-row justify-between">
                  <FText className="text-neutral">You will stake</FText>
                  <FText bold>{display}</FText>
                </View>
                <View className="flex-row justify-between">
                  <FText className="text-neutral">Estimated yearly earnings</FText>
                  <FText className="text-success" bold>
                    +${estimatedEarnings.toFixed(2)}
                  </FText>
                </View>
              </View>
            </View>
          )}

          {/* Boutons */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 rounded-xl border-2 border-neutral/20 py-4">
              <FText className="text-center" bold>Cancel</FText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              disabled={!amount || parseFloat(amount) === 0}
              className={`flex-1 rounded-xl py-4 ${
                !amount || parseFloat(amount) === 0 ? 'bg-neutral/20' : 'bg-primary'
              }`}>
              <FText className="text-center text-white" bold>Confirm Stake</FText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};