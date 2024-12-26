import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { isAddress } from 'viem';

import { Button } from '~/components/Button';
import { HeaderBar } from '~/components/HeaderBar';
import AmountInput from '~/components/Send/AmountInput';
import RecipientInput from '~/components/Send/RecipientInput';
import { Frame } from '~/components/Wrappers/Frame';

import { useAppData } from '~/components/Wrappers/AppData';
import viem from '~/services/viemService';
import { parseEther } from 'viem';

interface Token {
  symbol: string;
  name: string;
  icon: string; // Add logic to display icons if necessary
}

export default function Send() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  const isRecipientValid = isAddress(recipient);
  const isAmountValid = parseFloat(amount) > 0;

  const isInputValid = isRecipientValid && isAmountValid;

  const { wallet } = useAppData();

  const supportedTokens = [
    { symbol: 'ETH', name: 'Ethereum', icon: 'eth-icon-url', tokenAdress: 'eth-token-address' },
    { symbol: 'BTC', name: 'Bitcoin', icon: 'btc-icon-url', tokenAdress: 'btc-token-address' },
    { symbol: 'USDT', name: 'Tether', icon: 'usdt-icon-url', tokenAdress: 'usdt-token-address' },
    { symbol: 'DAI', name: 'Dai', icon: 'dai-icon-url', tokenAdress: 'dai-token-address' },
  ];

  const handleSendPress = () => {
    Alert.alert('Sending', `Sending ${amount} ${selectedToken?.symbol} to ${recipient}`);
    if (wallet.provider && selectedToken) {
      // Replace with actual token transfer logic
      // viem.sendERC20(wallet.provider, recipient, parseEther(amount), selectedToken.symbol);
      alert(
        'Sending funds to recipient: ' +
          recipient +
          ' with amount: ' +
          amount +
          'of' +
          selectedToken.symbol
      );
    } else {
      Alert.alert('Error', 'Wallet provider or token is not available');
    }
  };

  return (
    <Frame>
      <HeaderBar title="Send" />
      <View>
        <RecipientInput value={recipient} onChange={(value) => setRecipient(value)} />
      </View>
      <View>
        <AmountInput
          value={amount}
          onChange={(value) => setAmount(value)}
          tokens={supportedTokens}
          defaultToken={supportedTokens[0]}
          onTokenChange={(token) => setSelectedToken(token)}
        />
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
