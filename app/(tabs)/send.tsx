import { useState } from 'react';
import { View } from 'react-native';
import { isAddress } from 'viem';

import { Button } from '~/components/Button';
import { HeaderBar } from '~/components/HeaderBar';
import AmountInput from '~/components/Send/AmountInput';
import RecipientInput from '~/components/Send/RecipientInput';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { useSendTokenCallback } from '~/services/Send/useSendTokenCallback';
import { Token } from '~/types/supabaseTypes';

export default function Send() {
  const { user, tokens, privy } = useAppData();

  const wallet = privy.wallet;
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const possessedTokens = tokens.filter((token) =>
    user.balances.some((balance) => balance.token_address === token.address)
  );

  const selectedTokenBalance = selectedToken
    ? user.balances.find((balance) => balance.token_address === selectedToken.address)?.balance || 0
    : 0;

  const isRecipientValid = isAddress(recipient);
  console.log('Recipient:', recipient, 'is valid:', isRecipientValid);
  const isAmountValid = parseFloat(amount) > 0 && parseFloat(amount) <= selectedTokenBalance;

  const isInputValid = isRecipientValid && isAmountValid;

  const { handleSendTokenCallback } = useSendTokenCallback({
    selectedToken,
    wallet,
    recipient,
    amount,
    isInputValid,
  });

  const handleSendPress = () => {
    console.log('Send funds to:', recipient);
    handleSendTokenCallback();
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
            tokens={possessedTokens}
            user={user}
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
