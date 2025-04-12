import { OrderParameters } from '@cowprotocol/cow-sdk';
import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '~/components/Button';
import { HeaderBar } from '~/components/HeaderBar';
import { AmountInput } from '~/components/Send/AmountInput';
import { QuoteDisplay } from '~/components/Trade/QuoteDisplay';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { checkAndSetCowAllowance } from '~/services/CoW/setCowInfiniteAllowance';
import { signCowQuote } from '~/services/CoW/signCowQuote';
import { submitCowOrder } from '~/services/CoW/submitCowOrder';
import { Token } from '~/types/supabaseTypes';
import { amountToDigits } from '~/utils/helpers/tokens/amountToDigits';

export default function Trade() {
  const { user, tokens, privy } = useAppData();
  const wallet = privy.wallet;

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

  const handleTradePress = async () => {
    if (
      quote &&
      selectedPayToken &&
      user.wallet_address &&
      payAmount &&
      wallet &&
      wallet.status === 'connected'
    ) {
      const provider = wallet.provider;
      const formattedAmount = amountToDigits(Number(payAmount), selectedPayToken).toString();
      try {
        await checkAndSetCowAllowance(provider, selectedPayToken.address, user.wallet_address);
        const signature = await signCowQuote(quote, formattedAmount, user.wallet_address, provider);
        await submitCowOrder(quote, formattedAmount, signature);
      } catch (error) {
        console.error('Error signing or submitting quote:', error);
      }
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
      <View className="absolute bottom-[7rem] w-full items-center">
        <Button
          title="Trade"
          onPress={handleTradePress}
          className="bg-primary px-20"
          disabled={!isAmountValid}
        />
      </View>
    </Frame>
  );
}
