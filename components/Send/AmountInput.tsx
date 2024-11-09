import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { formatEther, parseEther } from 'viem';

import { Button } from '~/components/Button';
import FText from '~/components/Text/FText';
import { publicClient } from '~/utils/client';

const AmountInput = forwardRef((props, ref) => {
  const [amount, setAmount] = useState('');
  const [isValidAmount, setIsValidAmount] = useState(true);

  useImperativeHandle(ref, () => ({
    value: amount,
  }));

  const handleSendFunds = () => {
    if (isValidAmount && amount) {
      // Logic to send funds, this could involve interacting with a wallet or smart contract
      Alert.alert('Sending Funds', `Sending ${amount} ETH`);
    } else {
      Alert.alert('Error', 'Please enter a valid amount.');
    }
  };

  const handleAmountChange = (value: string) => {
    if (value.match(/^\d*\.?\d*$/)) {
      setAmount(value);
      setIsValidAmount(true);
    } else {
      setIsValidAmount(false);
    }
  };

  const checkFunds = async () => {
    try {
      const balance = await publicClient.getBalance({
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', // Replace with user address
      });
      const formattedBalance = formatEther(balance);
      console.log('Balance:', formattedBalance);

      if (parseFloat(amount) > parseFloat(formattedBalance)) {
        Alert.alert(
          'Insufficient Funds',
          `You have ${formattedBalance} ETH, which is not enough to send ${amount} ETH.`
        );
      } else {
        Alert.alert(
          'Sufficient Funds',
          `You have enough balance (${formattedBalance} ETH) to send ${amount} ETH.`
        );
      }
    } catch (error) {
      console.error('Error:', error);
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
          className={`flex-1 rounded-md bg-content p-3 ${
            amount === ''
              ? 'border-2 border-background text-text'
              : isValidAmount
                ? 'border-2 border-success text-success'
                : 'border-2 border-error text-error'
          }`}
          keyboardType="numeric"
          placeholder="Enter amount"
          value={amount}
          onChangeText={handleAmountChange}
          placeholderTextColor="#888"
        />
        {/* This is for debugging */}
        {/* <Button title="Check funds" onPress={checkFunds} disabled={!isValidAmount} /> */}
      </View>
    </View>
  );
});

export default AmountInput;
