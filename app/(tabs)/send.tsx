import { useState } from 'react';
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
import { Token } from '~/types/supabaseTypes'; // Updated to use the new Token type

export default function Send() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  const isRecipientValid = isAddress(recipient);
  const isAmountValid = parseFloat(amount) > 0;

  const isInputValid = isRecipientValid && isAmountValid;

  const { wallet } = useAppData();

  const supportedTokens: Token[] = [
    {
      address: 'eth-token-address',
      name: 'Ethereum',
      logo: null,
      symbol: 'ETH',
      digits: 18,
      description: 'Ethereum Mainnet Token',
      value: [],
      is_stablecoin: false,
    },
    {
      address: 'btc-token-address',
      name: 'Bitcoin',
      logo: null,
      symbol: 'BTC',
      digits: 8,
      description: 'Bitcoin Token',
      value: [],
      is_stablecoin: false,
    },
    {
      address: 'usdt-token-address',
      name: 'Tether',
      logo: null,
      symbol: 'USDT',
      digits: 6,
      description: 'Tether Stablecoin',
      value: [],
      is_stablecoin: true,
    },
  ];

  const handleSendPress = () => {
    Alert.alert('Sending', `Sending ${amount} ${selectedToken?.symbol} to ${recipient}`);
    if (wallet.provider && selectedToken) {
      // Replace with actual token transfer logic
      // Example: viem.sendERC20(wallet.provider, recipient, parseEther(amount), selectedToken.address);
      alert(
        `Sending ${amount} ${selectedToken.symbol} to ${recipient} using token contract at ${selectedToken.address}`
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
