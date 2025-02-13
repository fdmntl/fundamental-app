import { Feather } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, Modal, FlatList, Image } from 'react-native';

import { FText } from '~/components/Text/FText';
import { getCowQuote } from '~/services/CoW/getCowQuote';
import { Token, User } from '~/types/supabaseTypes';
import { debounce } from '~/utils/helpers/debounce';
import { tokenIcons } from '~/utils/helpers/mappings/tokenIcons';
import { roundNumberToDecimal } from '~/utils/helpers/numbers/roundNumberToDecimal';
import { amountToDigits } from '~/utils/helpers/tokens/amountToDigits';
import { digitsToAmount } from '~/utils/helpers/tokens/digitsToAmount';
import { getTokenAmountPrice } from '~/utils/helpers/tokens/getTokenAmountPrice';

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
  const [quoteValue, setQuoteValue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setIsPickerOpen(false);
    if (onTokenChange) onTokenChange(token);
  };

  const tokenIcon = (selectedToken && tokenIcons[selectedToken.symbol]) || null;

  // Function to fetch quote when all conditions are met
  const handleCalculateQuote = async () => {
    try {
      if (!selectedToken || !youPayValue || !youPayToken || !user.wallet_address) return;

      setIsLoading(true);

      const youPayValueConverted = amountToDigits(youPayValue, youPayToken);
      const quote = await getCowQuote(
        user.wallet_address,
        youPayToken.address,
        selectedToken.address,
        youPayValueConverted.toString()
      );

      const formattedQuote = digitsToAmount(Number(quote.buyAmount), selectedToken);
      setQuoteValue(formattedQuote);
    } catch (error) {
      console.error('Error calculating quote:', error);
      alert('Error calculating quote. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Wrapped the old handleCalculateQuote in debounce
  const debouncedCalculateQuote = useCallback(debounce(handleCalculateQuote, 500), [
    youPayValue,
    youPayToken,
    selectedToken,
    user.wallet_address,
  ]);

  // Trigger debouncedCalculateQuote on parameter change
  useEffect(() => {
    if (youPayValue > 0 && youPayToken && selectedToken && user.wallet_address) {
      debouncedCalculateQuote();
    }
  }, [youPayValue, youPayToken, selectedToken, user.wallet_address, debouncedCalculateQuote]);

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
      <View className="flex-row items-center">
        <FText
          className={`flex-1 rounded-md bg-content !text-4xl font-semibold ${quoteValue && !isLoading ? '!text-text' : '!text-neutral'}`}
          bold>
          {isLoading
            ? 'Calculating Quote'
            : `${roundNumberToDecimal(quoteValue)} ${selectedToken?.symbol || ''}`}
        </FText>
      </View>
      <FText className="!text-neutral" bold>
        ≈${getTokenAmountPrice(selectedToken?.address || '', Number(quoteValue), tokens).toFixed(2)}
      </FText>
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
