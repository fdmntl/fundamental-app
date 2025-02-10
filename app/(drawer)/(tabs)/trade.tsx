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

  const [amount, setAmount] = useState(''); // Payment input value
  const [selectedToken, setSelectedToken] = useState<Token | null>(null); // Selected payment token
  const possessedTokens = user.balances
    .map((balance) =>
      tokens.find((token) => token.address.toLowerCase() === balance.address.toLowerCase())
    )
    .filter((token) => token !== undefined) as Token[];

  const selectedTokenBalance = selectedToken
    ? user.balances.find((balance) => balance.address === selectedToken.address)?.balance || 0
    : 0;

  const isAmountValid = parseFloat(amount) > 0 && parseFloat(amount) <= selectedTokenBalance;

  return (
    <Frame>
      <HeaderBar title="Trade" />
      <View>
        {/* Amount Input for "You Pay" */}
        <AmountInput
          value={amount}
          onChange={(value) => setAmount(value)}
          tokens={possessedTokens}
          user={user}
          selectedTokenBalance={selectedTokenBalance}
          onTokenChange={(token) => setSelectedToken(token)}
          title="You Pay"
        />

        {/* Quote Display */}
        <QuoteDisplay
          tokens={possessedTokens}
          user={user}
          selectedTokenBalance={selectedTokenBalance}
          youPayValue={parseFloat(amount) || 0} // Pass payment amount
          youPayToken={selectedToken || possessedTokens[0]} // Pass selected payment token or default to the first token
        />
      </View>
    </Frame>
  );
}
