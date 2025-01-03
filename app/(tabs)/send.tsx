import { useState } from 'react';
import { View, Alert } from 'react-native';
import { isAddress } from 'viem';

import { Button } from '~/components/Button';
import { HeaderBar } from '~/components/HeaderBar';
import AmountInput from '~/components/Send/AmountInput';
import RecipientInput from '~/components/Send/RecipientInput';
import { Frame } from '~/components/Wrappers/Frame';
import { useAppData } from '~/components/Wrappers/AppData';
import { Token } from '~/types/supabaseTypes';

export default function Send() {
  const { userData, tokens } = useAppData();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  // Uncomment for mock testing:
  /*
  const mockUserData = {
    id: 'user1',
    created_at: '2025-01-01T00:00:00Z',
    wallet_address: '0x123456789',
    balances: [
      { token_address: '0xToken1', balance: 100 },
      { token_address: '0xToken2', balance: 50 },
      { token_address: '0xToken3', balance: 0 },
    ],
  };

  const mockTokens = [
    {
      address: '0xToken1',
      name: 'Wrapped ETH',
      symbol: 'WETH',
      digits: 18,
      description: 'First mock token',
      value: [],
      is_stablecoin: false,
    },
    {
      address: '0xToken2',
      name: 'USDC Coin',
      symbol: 'USDC',
      digits: 8,
      description: 'Second mock token',
      value: [],
      is_stablecoin: true,
    },
    {
      address: '0xToken3',
      name: 'Token Three',
      symbol: 'TKN3',
      digits: 6,
      description: 'Third mock token',
      value: [],
      is_stablecoin: false,
    },
  ];
  */

  // Map balances to a lookup object for quick access
  const balanceMap = (userData?.balances ?? []).reduce(
    (
      acc: Record<string, number>,
      { token_address, balance }: { token_address: string; balance: number }
    ): Record<string, number> => {
      acc[token_address] = balance;
      return acc;
    },
    {} as Record<string, number> // Ensure the initial value is typed correctly
  );

  // Filter tokens based on user balances
  const userTokens = balanceMap
    ? tokens.filter((token) => balanceMap[token.address] !== undefined)
    : [];

  // Get the balance of the selected token
  const selectedTokenBalance =
    selectedToken && balanceMap ? balanceMap[selectedToken.address] || 0 : 0;

  const isRecipientValid = isAddress(recipient);
  const isAmountValid = parseFloat(amount) > 0 && parseFloat(amount) <= selectedTokenBalance;

  const isInputValid = isRecipientValid && isAmountValid;

  const handleSendPress = () => {
    Alert.alert('Sending', `Sending ${amount} ${selectedToken?.symbol} to ${recipient}`);
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
          tokens={userTokens}
          defaultToken={userTokens[0]}
          selectedTokenBalance={selectedTokenBalance}
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
