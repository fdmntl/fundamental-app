import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Modal, FlatList, Image } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Import Feather icons
import { FText } from '~/components/Text/FText';
import { Token } from '~/types/supabaseTypes';

interface AmountInputProps {
  onChange: (value: string) => void;
  value: string;
  tokens: Token[];
  defaultToken?: Token;
  onTokenChange?: (token: Token) => void;
}

export const AmountInput = ({
  onChange,
  value,
  tokens,
  defaultToken,
  onTokenChange,
}: AmountInputProps) => {
  const [isValidAmount, setIsValidAmount] = useState(true);
  const [selectedToken, setSelectedToken] = useState<Token | undefined>(
    defaultToken || (tokens.length > 0 ? tokens[0] : undefined)
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleInputChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    if (numericValue.match(/^\d*\.?\d*$/)) {
      setIsValidAmount(true);
      onChange(numericValue);
    } else {
      setIsValidAmount(false);
    }
  };

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setIsPickerOpen(false);
    onTokenChange && onTokenChange(token);
  };

  return (
    <View className="mb-4 rounded-xl bg-content p-4">
      <View className="mb-4 flex-row items-center justify-between">
        <FText className="!text-2xl text-text" bold>
          Amount
        </FText>
        <TouchableOpacity
          className="flex-row items-center space-x-2 rounded-lg px-4 py-2"
          onPress={() => setIsPickerOpen(true)}>
          <FText className=" text-text" bold>
            {selectedToken?.symbol || 'Select Token'}
          </FText>
        </TouchableOpacity>
      </View>
      <View className="flex-row items-center">
        <TextInput
          className={`flex-1 rounded-lg bg-content p-3 text-lg ${
            value === ''
              ? 'border-2 border-background text-text'
              : isValidAmount
                ? 'border-2 border-green-500 text-green-600'
                : 'border-2 border-red-500 text-red-600'
          }`}
          keyboardType="numeric"
          placeholder="Enter amount"
          value={value}
          onChangeText={handleInputChange}
          placeholderTextColor="#888"
        />
      </View>
      <Modal visible={isPickerOpen} transparent animationType="fade">
        <View className="flex-1 items-center justify-center">
          <View className="absolute h-full w-full bg-background opacity-50" />
          <View className="w-11/12 max-w-md rounded-lg bg-content p-6">
            <FText className="text-text" bold>
              Select a token
            </FText>
            <FlatList
              data={tokens}
              keyExtractor={(item) => item.address} // Using address as the unique key
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="flex-row items-center rounded-lg p-3"
                  onPress={() => handleTokenSelect(item)}>
                  {item.logo ? (
                    <Image source={{ uri: item.logo }} className="mr-2 h-6 w-6" />
                  ) : (
                    <Feather name="cpu" size={24} className="mr-2 text-text" />
                  )}
                  <Text className="text-lg text-text">{item.symbol}</Text>
                </TouchableOpacity>
              )}
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
