import React, { useState } from 'react';
import { View, TextInput } from 'react-native';

import { FText } from '~/components/Text/FText';

interface AmountInputProps {
  onChange: (value: string) => void;
  value: string;
}

export const AmountInput = ({ onChange, value }: AmountInputProps) => {
  const [isValidAmount, setIsValidAmount] = useState(true);

  // const checkFunds = async () => {
  //   try {
  //     const balance = await publicClient.getBalance({
  //       address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', // Replace with user address
  //     });
  //     const formattedBalance = formatEther(balance);
  //     console.log('Balance:', formattedBalance);

  //     if (parseFloat(amount) > parseFloat(formattedBalance)) {
  //       Alert.alert(
  //         'Insufficient Funds',
  //         `You have ${formattedBalance} ETH, which is not enough to send ${amount} ETH.`
  //       );
  //     } else {
  //       Alert.alert(
  //         'Sufficient Funds',
  //         `You have enough balance (${formattedBalance} ETH) to send ${amount} ETH.`
  //       );
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

  const handleInputChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    if (numericValue.match(/^\d*\.?\d*$/)) {
      setIsValidAmount(true);
      onChange(numericValue);
    } else {
      setIsValidAmount(false);
    }
  };

  return (
    <View className="mb-4 h-40 rounded-xl bg-content p-4">
      <View className="flex-row items-center">
        <FText className="!text-2xl text-text" bold>
          Amount
        </FText>
      </View>
      <View className="mt-4 flex-row items-center">
        <TextInput
          keyboardType="numeric"
          className={`flex-1 rounded-md bg-content p-3 ${
            value === ''
              ? 'border-[3px] border-background text-text'
              : isValidAmount
                ? 'border-[3px] border-success text-success'
                : 'border-[3px] border-error text-error'
          }`}
          placeholder="Enter amount"
          value={value.toString()}
          onChangeText={handleInputChange}
          placeholderTextColor="#888"
        />
        {/* This is for debugging */}
        {/* <Button title="Check funds" onPress={checkFunds} disabled={!isValidAmount} /> */}
      </View>
    </View>
  );
};

export default AmountInput;
