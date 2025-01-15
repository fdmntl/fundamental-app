import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput } from 'react-native';
import { isAddress } from 'viem';
import { resolveENS } from '~/services/viemService';
import { FText } from '~/components/Text/FText';
import { debounce } from '~/utils/helpers/debounce';

interface RecipientInputProps {
  value: string;
  onChange: (value: string) => void;
}

const RecipientInput = ({ value, onChange }: RecipientInputProps) => {
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState(value);

  const handleResolveENS = useCallback(async (recipient: string) => {
    if (isAddress(recipient)) {
      setResolvedAddress(recipient);
      onChange(recipient);
      return;
    }

    try {
      const address = await resolveENS(recipient);
      setResolvedAddress(address);
      onChange(address || recipient);
    } catch (error) {
      setResolvedAddress(null);
      onChange(recipient);
    }
  }, []);

  const debouncedResolveENS = useCallback(debounce(handleResolveENS, 500), [handleResolveENS]);

  useEffect(() => {
    if (inputValue.trim()) {
      debouncedResolveENS(inputValue);
    } else {
      setResolvedAddress(null);
      onChange('');
    }
  }, [inputValue, debouncedResolveENS]);

  const handleInputChange = (text: string) => {
    setInputValue(text);
    onChange(text);
  };

  return (
    <View className="h-fit w-full gap-4 rounded-xl bg-content p-6">
      <View className="flex-row items-center">
        <FText className="!text-2xl" bold>
          Recipient
        </FText>
      </View>
      <View className="flex-row items-center">
        <TextInput
          className={`flex-1 rounded-md bg-content text-4xl font-semibold
            ${inputValue === '' ? 'text-text' : resolvedAddress ? 'text-success' : 'text-error'}`}
          placeholder="0x1234...abcd"
          placeholderTextColor="#888"
          value={inputValue}
          onChangeText={handleInputChange}
        />
      </View>
    </View>
  );
};

export default RecipientInput;
