import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Modal, FlatList, Image } from 'react-native';

import { FText } from '~/components/Text/FText';
import { Token, User } from '~/types/supabaseTypes';
import { tokenIcons } from '~/utils/helpers/mappings/tokenIcons';
import { getTokenAmountPrice } from '~/utils/helpers/tokens/getTokenAmountPrice';
import { getUserTokenAmount } from '~/utils/helpers/tokens/getUserTokenAmount';
import { getUserTokenValue } from '~/utils/helpers/tokens/getUserTokenValue';

interface AmountInputProps {
  onChange: (value: string) => void;
  value: string;
  tokens: Token[];
  user: User;
  defaultToken?: Token;
  selectedTokenBalance: number;
  onTokenChange?: (token: Token) => void;
  title?: string;
}

export const AmountInput = ({
  onChange,
  value,
  tokens,
  user,
  defaultToken = undefined,
  selectedTokenBalance,
  onTokenChange,
  title = 'Amount',
}: AmountInputProps) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | undefined>(defaultToken);

  const handleInputChange = (value: string) => {
    onChange(value.replace(/[^0-9.]/g, ''));
  };

  const balanceDisplay =
    selectedToken && selectedTokenBalance
      ? getUserTokenAmount(selectedToken?.address, tokens, user)
      : 0;

  const isValidAmount = value !== '' && !isNaN(Number(value)) && Number(value) <= balanceDisplay;

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setIsPickerOpen(false);
    if (onTokenChange) onTokenChange(token);
  };

  const tokenIcon = (selectedToken && tokenIcons[selectedToken.symbol]) || null;

  return (
    <View className="h-fit w-full gap-2 rounded-xl bg-content p-4 pb-6 pl-6">
      <View className="flex-row items-center justify-between">
        <FText className="!text-2xl text-text" bold>
          {title}
        </FText>
        <TouchableOpacity
          className="flex-row items-center space-x-2 px-4 py-3"
          onPress={() => {
            if (tokens.length > 1) setIsPickerOpen(true);
          }}>
          {tokenIcon ? (
            <Image source={tokenIcon} className="mr-2 h-8 w-8" />
          ) : (
            <Feather name="globe" size={26} className="mr-2 text-neutral" />
          )}
          <FText className="text-info" bold>
            {selectedToken?.symbol || 'Select Token'}
          </FText>
          {tokens.length > 1 && <Feather name="chevron-down" size={28} className="text-neutral" />}
        </TouchableOpacity>
      </View>
      <View className="-mt-2 flex-row items-center">
        <TextInput
          className={`flex-1 rounded-lg bg-content text-4xl font-semibold
            ${value === '' ? 'text-text' : isValidAmount ? 'text-text' : 'text-error'}`}
          keyboardType="numeric"
          placeholder={`0 ${selectedToken?.symbol || ''}`}
          value={value}
          onChangeText={handleInputChange}
          placeholderTextColor="#888"
        />
      </View>
      <View className="flex-row items-center justify-between">
        <FText className="!text-neutral" bold>
          ≈${getTokenAmountPrice(selectedToken?.address || '', Number(value), tokens).toFixed(2)}
        </FText>
        <View className="flex-row items-center gap-2">
          <FText className="!text-lg text-text" bold>
            {balanceDisplay.toFixed(2)} {selectedToken?.symbol}
          </FText>
          <TouchableOpacity
            className="rounded-xl bg-primary px-2"
            onPress={() => onChange(balanceDisplay.toString())}>
            <FText className="text-white" bold>
              Max
            </FText>
          </TouchableOpacity>
        </View>
      </View>
      <Modal visible={isPickerOpen} transparent animationType="fade">
        <View className="flex-1 items-center justify-center">
          <View className="absolute h-full w-full bg-background opacity-50" />
          <View className="w-11/12 max-w-md gap-6 rounded-2xl bg-content p-6">
            <FText className="!text-2xl text-text" bold>
              Select a token
            </FText>
            <FlatList
              data={tokens}
              keyExtractor={(item) => item.address + item.symbol}
              ItemSeparatorComponent={() => <View className="h-4" />}
              renderItem={({ item }) => {
                const icon = tokenIcons[item.symbol] || tokenIcons.default;
                const isSelected = selectedToken?.address === item.address;
                return (
                  <TouchableOpacity
                    className="flex-row items-center gap-4 rounded-2xl bg-background p-4"
                    onPress={() => handleTokenSelect(item)}>
                    <Image source={icon} className="h-12 w-12" />
                    <FText className="text-lg text-text" bold>
                      {item.symbol}
                    </FText>
                    {isSelected && <Feather name="check" size={32} className="text-success" />}
                    <View className="ml-auto items-end justify-end">
                      <FText className="text-text" bold>
                        {getUserTokenAmount(item.address, tokens, user).toFixed(2)}
                      </FText>
                      <FText className="text-text">
                        ${getUserTokenValue(item.address, tokens, user).toFixed(2)}
                      </FText>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity
              className="w-full items-center rounded-lg"
              onPress={() => setIsPickerOpen(false)}>
              <FText className="text-lg text-text" bold>
                Close
              </FText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
