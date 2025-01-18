import { useState } from 'react';
import { View } from 'react-native';

import { HeaderBar } from '~/components/HeaderBar';
import { AmountInput } from '~/components/Send/AmountInput';
import { QuoteDisplay } from '~/components/Trade/QuoteDisplay';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { Token } from '~/types/supabaseTypes';

export default function Trade() {
  const { user, tokens } = useAppData();

  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const possessedTokens = tokens.filter((token) =>
    user.balances.some((balance) => balance.token_address === token.address)
  );

  const selectedTokenBalance = selectedToken
    ? user.balances.find((balance) => balance.token_address === selectedToken.address)?.balance || 0
    : 0;

  const isAmountValid = parseFloat(amount) > 0 && parseFloat(amount) <= selectedTokenBalance;

  return (
    <Frame>
      <HeaderBar title="Trade" />
      <View className="">
        <AmountInput
          value={amount}
          onChange={(value) => setAmount(value)}
          tokens={possessedTokens}
          user={user}
          selectedTokenBalance={selectedTokenBalance}
          onTokenChange={(token) => setSelectedToken(token)}
          title="You Pay"
        />
        <QuoteDisplay />
      </View>
    </Frame>
  );
}
