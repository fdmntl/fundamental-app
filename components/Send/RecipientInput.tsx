import { Feather } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import { View, TextInput } from 'react-native';
import { isAddress } from 'viem';

import { FText } from '~/components/Text/FText';
import { resolveENS } from '~/services/viemService';
import { debounce } from '~/utils/helpers/debounce';
import { trimAddress } from '~/utils/helpers/strings/trimAddress';

interface RecipientInputProps {
  value: string;
  onChange: (value: string) => void;
  resetValue?: boolean;
}

export const RecipientInput = ({ value, onChange, resetValue = false }: RecipientInputProps) => {
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    if (resetValue && inputValue !== '') {
      setInputValue('');
      onChange('');
      setResolvedAddress(null);
    }
  }, [resetValue, inputValue, onChange]);

  const handleResolveENS = useCallback(async (recipient: string) => {
    setResolvedAddress(null);
    if (isAddress(recipient)) {
      setResolvedAddress(recipient);
      onChange(recipient);
      return;
    }

    try {
      const address = await resolveENS(recipient);
      if (address) {
        setResolvedAddress(address);
        onChange(address);
      }
    } catch {
      setResolvedAddress(null);
    }
  }, []);

  const debouncedResolveENS = useCallback(debounce(handleResolveENS, 500), [handleResolveENS]);

  useEffect(() => {
    if (inputValue.trim()) {
      debouncedResolveENS(inputValue);
    } else {
      setResolvedAddress(null);
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
          autoCapitalize="none"
        />
      </View>
      <View className="-mt-2 flex-row items-center gap-2">
        <Feather name="info" size={20} className="text-neutral" />
        {resolvedAddress ? (
          <FText className="!text-neutral" bold>
            {trimAddress(resolvedAddress)}
          </FText>
        ) : (
          <FText className="!text-neutral" bold>
            {inputValue ? 'Invalid Address' : 'Please enter an address or ens'}
          </FText>
        )}
      </View>
    </View>
  );
};
