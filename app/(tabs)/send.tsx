import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import { isAddress } from 'viem';

import { Button } from '~/components/Button';
import { HeaderBar } from '~/components/HeaderBar';
import AmountInput from '~/components/Send/AmountInput';
import RecipientInput from '~/components/Send/RecipientInput';
import { Frame } from '~/components/Wrappers/Frame';

export default function Send() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const isRecipientValid = isAddress(recipient);
  const isAmountValid = parseFloat(amount) > 0;

  const isInputValid = isRecipientValid && isAmountValid;

  const handleSendPress = () => {
    Alert.alert('Sending', `Sending ${amount} to ${recipient}`);
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
