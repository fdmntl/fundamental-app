import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { View, TouchableOpacity, Modal, FlatList, Image, TextInput } from 'react-native';

import { FText } from '~/components/Text/FText';
import { Token, User } from '~/types/supabaseTypes';
import { tokenIcons } from '~/utils/helpers/mappings/tokenIcons';

import { getCowQuote } from '~/services/CoW/getCowQuote';

interface QuoteDisplayProps {
  tokens: Token[];
  user: User;
  defaultToken?: Token;
  selectedTokenBalance: number;
  onTokenChange?: (token: Token) => void;
  title?: string;
  youPayValue: number;
  youPayToken: Token;
}

export const QuoteDisplay = ({
  tokens,
  user,
  defaultToken = undefined,
  selectedTokenBalance,
  onTokenChange,
  title = 'You Get',
  youPayValue,
  youPayToken,
}: QuoteDisplayProps) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | undefined>(defaultToken);
  const [quoteValue, setQuoteValue] = useState<string | null>(null);

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setIsPickerOpen(false);
    if (onTokenChange) onTokenChange(token);
  };

  const tokenIcon = (selectedToken && tokenIcons[selectedToken.symbol]) || null;

  const handleCalculateQuote = async () => {
    if (selectedToken) {
      const quote = await getCowQuote(
        user.wallet_address,
        youPayToken.address,
        selectedToken.address,
        youPayValue.toString()
      );
      const quoteValue = quote.buyAmount; // Replace 'relevantStringField' with the actual field name
      setQuoteValue(quoteValue);
      console.log('Calculating Quote...');
      console.log(`You Pay Value: ${youPayValue}`);
      console.log(`You Pay Token: ${youPayToken.symbol}`);
      console.log(`You Get Value: ${quoteValue}`);
      console.log(`You Get Token: ${selectedToken?.symbol || 'None'}`);
    } else {
      alert('Please select a token to get a quote.');
    }
  };

  return (
    <View className="h-fit w-full gap-2 rounded-xl bg-content p-4 pb-6 pl-6">
      <View className="flex-row items-center justify-between">
        <FText className="!text-2xl text-text" bold>
          {title}
        </FText>
        <TouchableOpacity
          className="flex-row items-center space-x-2 rounded-full bg-background px-4 py-3"
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
        <FText
          className={`flex-1 rounded-md bg-content text-4xl font-semibold ${quoteValue ? '!text-text' : '!text-neutral'}`}
          bold>
          {youPayValue} {youPayToken.symbol} {quoteValue || 'quote'} {selectedToken?.symbol}
        </FText>
      </View>
      <TouchableOpacity
        className="mt-4 w-full rounded-lg bg-primary px-4 py-3"
        onPress={handleCalculateQuote}>
        <FText className="text-center text-white" bold>
          Calculate Quote
        </FText>
      </TouchableOpacity>
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
