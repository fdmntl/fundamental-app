import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput } from 'react-native';
import { isAddress } from 'viem';
import { resolveENS } from '~/services/viemService';
import { FText } from '~/components/Text/FText';

interface RecipientInputProps {
  value: string;
  onChange: (value: string) => void;
}

const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const RecipientInput = ({ value, onChange }: RecipientInputProps) => {
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState(value);

  const handleResolveENS = useCallback(async (ensName: string) => {
    // console.log('Resolving ENS domain:', ensName); // Debugging: ENS domain input
    if (isAddress(ensName)) {
      // console.log('Input is a valid Ethereum address:', ensName); // Debugging: Valid address
      setResolvedAddress(ensName);
      onChange(ensName);
      return;
    }

    try {
      const address = await resolveENS(ensName);
      // console.log('Resolved Address:', address); // Debugging: ENS resolution result
      setResolvedAddress(address);
      onChange(address || ensName);
    } catch (error) {
      // console.error('Error while resolving ENS domain:', error); // Debugging: Error logs
      setResolvedAddress(null);
      onChange(ensName);
    }
  }, []);

  const debouncedResolveENS = useCallback(debounce(handleResolveENS, 500), [handleResolveENS]);

  useEffect(() => {
    if (inputValue.trim()) {
      // console.log('Debounced ENS resolution triggered for:', inputValue); // Debugging: Triggered input
      debouncedResolveENS(inputValue);
    } else {
      // console.log('Empty input, skipping ENS resolution'); // Debugging: Empty input case
      setResolvedAddress(null);
      onChange('');
    }
  }, [inputValue, debouncedResolveENS]);

  const handleInputChange = (text: string) => {
    // console.log('Input changed:', text); // Debugging: Input change
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
      {/* {resolvedAddress && (
        <FText className="text-sm text-success">Resolved Address: {resolvedAddress}</FText>
      )}
      {!resolvedAddress && inputValue && !isValidENS && (
        <FText className="text-sm text-error">Invalid address or ENS domain</FText>
      )} */}
    </View>
  );
};

export default RecipientInput;
