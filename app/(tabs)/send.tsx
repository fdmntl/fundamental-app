import { useState } from 'react';
import { View, Alert } from 'react-native';
import { isAddress } from 'viem';

import { Button } from '~/components/Button';
import { HeaderBar } from '~/components/HeaderBar';
import AmountInput from '~/components/Send/AmountInput';
import RecipientInput from '~/components/Send/RecipientInput';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { Token } from '~/types/supabaseTypes';

// TODO: fix balance map using appData instead

export default function Send() {
  const { userData, tokens } = useAppData();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  // Map balances to a lookup object for quick access
  const balanceMap = Array.isArray(userData?.balances)
    ? userData.balances.reduce<Record<string, number>>(
        (
          acc: Record<string, number>,
          { token_address, balance }: { token_address: string; balance: number }
        ) => {
          acc[token_address] = balance;
          return acc;
        },
        {}
      )
    : {};

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
      <View className="flex-1 gap-4">
        <View>
          <RecipientInput value={recipient} onChange={(value) => setRecipient(value)} />
        </View>
        <View>
          <AmountInput
            value={amount}
            onChange={(value) => setAmount(value)}
            tokens={userTokens}
            selectedTokenBalance={selectedTokenBalance}
            onTokenChange={(token) => setSelectedToken(token)}
          />
        </View>
        <View className="absolute bottom-[6rem] w-full items-center">
          <Button
            title="Send Funds"
            onPress={handleSendPress}
            className={`bg-primary px-12 ${isInputValid ? '' : 'opacity-50'}`}
            disabled={!isInputValid}
          />
        </View>
      </View>
    </Frame>
  );
}
