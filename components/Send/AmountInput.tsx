import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Modal, FlatList, Image } from 'react-native';

import { FText } from '~/components/Text/FText';
import { Token } from '~/types/supabaseTypes';
import { tokenIcons } from '~/utils/helpers/mappings/tokenIcons';

// TODO: fix current balance, use token helpers

interface AmountInputProps {
  onChange: (value: string) => void;
  value: string;
  tokens: Token[];
  defaultToken?: Token;
  selectedTokenBalance: number;
  onTokenChange?: (token: Token) => void;
}

export const AmountInput = ({
  onChange,
  value,
  tokens,
  defaultToken,
  selectedTokenBalance,
  onTokenChange,
}: AmountInputProps) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | undefined>(
    defaultToken || (tokens.length > 0 ? tokens[0] : undefined)
  );

  const handleInputChange = (value: string) => {
    onChange(value.replace(/[^0-9.]/g, ''));
  };

  const isValidAmount =
    value !== '' && !isNaN(Number(value)) && Number(value) <= selectedTokenBalance;

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setIsPickerOpen(false);
    if (onTokenChange) onTokenChange(token);
  };

  return (
    <View className="h-fit w-full gap-2 rounded-xl bg-content p-4 pb-6 pl-6">
      <View className="flex-row items-center justify-between">
        <FText className="!text-2xl text-text" bold>
          Amount
        </FText>
        <TouchableOpacity
          className="flex-row items-center space-x-2 rounded-xl bg-background px-4 py-3"
          onPress={() => setIsPickerOpen(true)}>
          {selectedToken && tokenIcons[selectedToken.symbol] ? (
            <Image source={tokenIcons[selectedToken.symbol]} className="mr-2 h-8 w-8" />
          ) : (
            <Feather name="cpu" size={24} className="mr-2 text-text" />
          )}
          <FText className="text-info" bold>
            {selectedToken?.symbol || 'Select Token'}
          </FText>
        </TouchableOpacity>
      </View>
      <View className="flex-row items-center">
        <TextInput
          className={`flex-1 rounded-lg bg-content text-4xl font-semibold
            ${value === '' ? 'text-text' : isValidAmount ? 'text-success' : 'text-error'}`}
          keyboardType="numeric"
          placeholder={`0 ${selectedToken?.symbol}`}
          value={value}
          onChangeText={handleInputChange}
          placeholderTextColor="#888"
        />
      </View>
      <FText className="!text-lg text-info" bold>
        Balance: {selectedTokenBalance} {selectedToken?.symbol}
      </FText>
      <Modal visible={isPickerOpen} transparent animationType="fade">
        <View className="flex-1 items-center justify-center">
          <View className="absolute h-full w-full bg-background opacity-50" />
          <View className="w-11/12 max-w-md rounded-lg bg-content p-6">
            <FText className="text-text" bold>
              Select a token
            </FText>
            <FlatList
              data={tokens}
              keyExtractor={(item) => item.address + item.symbol}
              renderItem={({ item }) => {
                const icon = tokenIcons[item.symbol] || null;
                return (
                  <TouchableOpacity
                    className="flex-row items-center rounded-lg p-3"
                    onPress={() => handleTokenSelect(item)}>
                    {icon ? (
                      <Image source={icon} className="mr-2 h-6 w-6" />
                    ) : (
                      <Feather name="cpu" size={24} className="mr-2 text-text" />
                    )}
                    <Text className="text-lg text-text">{item.symbol}</Text>
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity
              className="mt-4 w-full items-center rounded-lg bg-content py-2"
              onPress={() => setIsPickerOpen(false)}>
              <Text className="text-lg text-text">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AmountInput;
