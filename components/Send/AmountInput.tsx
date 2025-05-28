import { Feather } from '@expo/vector-icons';
import { useState, useMemo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import { FText } from '~/components/Text/FText';
import { Token, User } from '~/types/supabaseTypes';
import { tokenIcons } from '~/utils/helpers/mappings/tokenIcons';
import { getTokenAmountPrice } from '~/utils/helpers/tokens/getTokenAmountPrice';
import { getUserTokenAmount } from '~/utils/helpers/tokens/getUserTokenAmount';
import { getUserTokenValue } from '~/utils/helpers/tokens/getUserTokenValue';
import { printToken } from '~/utils/helpers/tokens/printToken';

interface AmountInputProps {
  onChange: (value: string) => void;
  value: string;
  tokens: Token[];
  user: User;
  selectedToken: Token | null;
  selectedTokenBalance: number;
  onTokenChange?: (token: Token) => void;
  title?: string;
}

export const AmountInput = ({
  onChange,
  value,
  tokens,
  user,
  selectedToken,
  selectedTokenBalance,
  onTokenChange,
  title = 'Amount',
}: AmountInputProps) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [inputMode, setInputMode] = useState<'crypto' | 'fiat'>('crypto');

  // Calculate price per token (USD)
  const pricePerToken = useMemo(() => {
    if (!selectedToken) return 0;
    return getTokenAmountPrice(selectedToken.address, 1, tokens);
  }, [selectedToken, tokens]);

  // Calculate values for both modes
  const cryptoValue = useMemo(() => {
    if (inputMode === 'crypto') {
      return value;
    } else {
      // Convert fiat to crypto
      const v = parseFloat(value);
      if (!pricePerToken || value.trim() === '' || isNaN(v)) return '';
      return (v / pricePerToken).toString();
    }
  }, [value, inputMode, pricePerToken]);

  const fiatValue = useMemo(() => {
    if (inputMode === 'fiat') {
      return value;
    } else {
      // Convert crypto to fiat
      const v = parseFloat(value);
      if (!pricePerToken || isNaN(v)) return '';
      return (v * pricePerToken).toString();
    }
  }, [value, inputMode, pricePerToken]);

  const balanceDisplay =
    selectedToken && selectedTokenBalance
      ? getUserTokenAmount(selectedToken?.address, tokens, user)
      : 0;

  const maxFiat = (balanceDisplay * pricePerToken).toFixed(2);

  const isValidAmount = useMemo(() => {
    if (value === '' || isNaN(Number(value))) return false;
    if (inputMode === 'crypto') {
      return Number(value) <= balanceDisplay;
    } else {
      return Number(value) <= balanceDisplay * pricePerToken;
    }
  }, [value, inputMode, balanceDisplay, pricePerToken]);

  const handleInputChange = (val: string) => {
    const sanitizedValue = val.replace(/[^0-9.]/g, '');
    const isValidNumber = /^(\d+(\.\d{0,})?)?$/.test(sanitizedValue);
    if (isValidNumber) {
      onChange(sanitizedValue);
    }
  };

  const handleFiatToggle = () => {
    // When toggling, convert the value to the other mode
    if (inputMode === 'crypto') {
      // Convert crypto to fiat
      const v = parseFloat(value);
      if (!pricePerToken || isNaN(v)) {
        setInputMode('fiat');
        onChange('');
      } else {
        setInputMode('fiat');
        onChange((v * pricePerToken).toFixed(2));
      }
    } else {
      // Convert fiat to crypto
      const v = parseFloat(value);
      if (!pricePerToken || isNaN(v)) {
        setInputMode('crypto');
        onChange('');
      } else {
        setInputMode('crypto');
        onChange((v / pricePerToken).toString());
      }
    }
  };

  const handleTokenSelect = (token: Token) => {
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
          placeholder={inputMode === 'crypto' ? `0 ${selectedToken?.symbol || ''}` : '$0.00'}
          value={value}
          onChangeText={handleInputChange}
          placeholderTextColor="#888"
        />
      </View>
      <View className="flex-row items-center justify-between">
        <TouchableOpacity onPress={handleFiatToggle} activeOpacity={0.7}>
          <FText className="!text-neutral" bold>
            {inputMode === 'crypto'
              ? `=$${Number(fiatValue).toFixed(2)}`
              : `${Number(cryptoValue).toPrecision(6)} ${selectedToken?.symbol || ''}`}
          </FText>
        </TouchableOpacity>
        <View className="flex-row items-center gap-2">
          <FText className="!text-lg text-text" bold>
            {printToken(balanceDisplay, selectedToken ? selectedToken : undefined)}
            {selectedToken?.symbol}
          </FText>
          <TouchableOpacity
            className="rounded-xl bg-primary px-2"
            onPress={() => {
              if (inputMode === 'crypto') {
                onChange(
                  printToken(balanceDisplay, selectedToken ? selectedToken : undefined).toString()
                );
              } else {
                onChange(maxFiat.toString());
              }
            }}>
            <FText className="text-white" bold>
              Max
            </FText>
          </TouchableOpacity>
        </View>
      </View>
      <Modal visible={isPickerOpen} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setIsPickerOpen(false)}>
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
                className="w-full items-center rounded-lg bg-primary py-3"
                onPress={() => setIsPickerOpen(false)}>
                <FText className="text-lg text-text" bold>
                  Close
                </FText>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
