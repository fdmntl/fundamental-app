import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { isAddress, parseEther } from 'viem';

import { Button } from '~/components/Button';
import { HeaderBar } from '~/components/HeaderBar';
import AmountInput from '~/components/Send/AmountInput';
import RecipientInput from '~/components/Send/RecipientInput';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import viem from '~/services/viemService';

export default function Send() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const isRecipientValid = isAddress(recipient);
  const isAmountValid = parseFloat(amount) > 0;

  const isInputValid = isRecipientValid && isAmountValid;

  const { wallet } = useAppData();

  const handleSendPress = () => {
    Alert.alert('Sending', `Sending ${amount} to ${recipient}`);
    if (wallet.provider) {
      viem.sendETH(wallet.provider, recipient, parseEther(amount));
    } else {
      Alert.alert('Error', 'Wallet provider is not available');
    }
  };

  return (
    <Frame>
      <HeaderBar title="Send" />
      <View>
        <RecipientInput value={recipient} onChange={(value) => setRecipient(value)} />
      </View>
      <View>
        <AmountInput value={amount} onChange={(value) => setAmount(value)} />
      </View>
      <View className="mt-4 flex w-full items-center justify-center">
        <Button
          title="Send Funds"
          onPress={handleSendPress}
          className={`bg-primary px-12 ${isInputValid ? '' : 'opacity-50'}`}
          disabled={!isInputValid}
        />
      </View>
    </Frame>
  );
}
