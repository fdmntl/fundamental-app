import { View, Alert } from 'react-native';
import React, { useRef } from 'react';

import { HeaderBar } from '~/components/HeaderBar';
import { Frame } from '~/components/Wrappers/Frame';

import RecipientInput from '~/components/Send/RecipientInput';
import AmountInput from '~/components/Send/AmountInput';
import { Button } from '~/components/Button';

export default function Send() {
  const recipientRef = useRef<{ value: string } | null>(null);
  const amountRef = useRef<{ value: string } | null>(null);

  const handleSendPress = () => {
    const recipientAddress = recipientRef.current?.value;
    const amount = amountRef.current?.value;

    if (recipientAddress && amount) {
      Alert.alert('Sending', `Sending ${amount} to ${recipientAddress}`);
    } else {
      Alert.alert('Error', 'Please ensure both recipient address and amount are filled.');
    }
  };

  return (
    <Frame>
      <HeaderBar title="Send" />
      <View>
        <RecipientInput ref={recipientRef} />
      </View>
      <View>
        <AmountInput ref={amountRef} />
      </View>
      <View className="mt-4">
        <Button title="Send Funds" onPress={handleSendPress} />
      </View>
    </Frame>
  );
}
