import { OrderParameters } from '@cowprotocol/cow-sdk';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '~/components/Button';
import { HeaderBar } from '~/components/HeaderBar';
import { AmountInput } from '~/components/Send/AmountInput';
import { QuoteDisplay } from '~/components/Trade/QuoteDisplay';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { Token } from '~/types/supabaseTypes';
import { roundNumberToDecimal } from '~/utils/helpers/numbers/roundNumberToDecimal';
import { digitsToAmount } from '~/utils/helpers/tokens/digitsToAmount';

export default function Trade() {
  const { user, tokens } = useAppData();

  const [payAmount, setPayAmount] = useState('');
  const [selectedPayToken, setSelectedPayToken] = useState<Token | null>(null);
  const [selectedGetToken, setSelectedGetToken] = useState<Token | null>(null);
  const possessedTokens = user.balances
    .map((balance) => tokens.find((token) => token.address === balance.address))
    .filter((token) => token !== undefined) as Token[];

  const selectedTokenBalance = selectedPayToken
    ? user.balances.find((balance) => balance.address === selectedPayToken.address)?.balance || 0
    : 0;

  const isAmountValid = parseFloat(payAmount) > 0 && parseFloat(payAmount) <= selectedTokenBalance;

  const [quote, setQuote] = useState<OrderParameters | null>(null);

  const handleTradePress = () => {
    console.log('Trade button pressed');
    console.log('Amount:', payAmount);
    console.log('Selected Pay Token:', selectedPayToken?.name);
    console.log('Selected Get Token:', selectedGetToken?.name);
    if (quote && selectedGetToken) {
      const formattedQuote = digitsToAmount(Number(quote.buyAmount), selectedGetToken);
      console.log('Quote amount:', roundNumberToDecimal(formattedQuote));
    }
  };

  return (
    <Frame>
      <HeaderBar title="Trade" />
      <View className="flex-1 gap-4">
        {/* Amount Input for "You Pay" */}
        <AmountInput
          value={payAmount}
          onChange={(value) => setPayAmount(value)}
          tokens={possessedTokens}
          user={user}
          selectedTokenBalance={selectedTokenBalance}
          onTokenChange={(token) => setSelectedPayToken(token)}
          title="You Pay"
        />

        {/* Quote Display */}
        <QuoteDisplay
          tokens={possessedTokens}
          user={user}
          youPayValue={parseFloat(payAmount) || 0}
          youPayToken={selectedPayToken || possessedTokens[0]}
          onTokenChange={(token) => setSelectedGetToken(token)}
          onQuote={(quote) => setQuote(quote)}
        />
      </View>
      <View className="absolute bottom-[6rem] w-full items-center">
        <Button
          title="Trade"
          onPress={handleTradePress}
          className={`bg-primary px-12 ${isAmountValid ? '' : 'opacity-50'}`}
          disabled={!isAmountValid}
        />
      </View>
    </Frame>
  );
}
