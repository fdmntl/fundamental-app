import React from 'react';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { Button } from '~/components/Button';
import { HeaderBar } from '~/components/HeaderBar';
import { AmountInput } from '~/components/Send/AmountInput';
import { QuoteDisplay } from '~/components/Trade/QuoteDisplay';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { refreshUserBalances } from '~/services/refreshUserBalance';
import { Token } from '~/types/supabaseTypes';
import { ScrollView, RefreshControl } from 'react-native-gesture-handler';

export default function Trade() {
  const { user, tokens, updateUser } = useAppData();

  const [amount, setAmount] = useState(''); // Payment input value
  const [selectedToken, setSelectedToken] = useState<Token | null>(null); // Selected payment token
  const possessedTokens = user.balances
    .map((balance) => tokens.find((token) => token.address === balance.address))
    .filter((token) => token !== undefined) as Token[];

  const selectedTokenBalance = selectedToken
    ? user.balances.find((balance) => balance.address === selectedToken.address)?.balance || 0
    : 0;

  const isAmountValid = parseFloat(amount) > 0 && parseFloat(amount) <= selectedTokenBalance;

  const handleTradePress = () => {
    console.log('Trade button pressed');
    console.log('Amount:', amount);
    console.log('Selected Token:', selectedTokenBalance);
  };

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = useCallback(async () => {
    // Ensure refresh only happens when triggered otherwise it refreshes the user balances on every render (not cool)
    if (!refreshing) {
      setRefreshing(true);
      try {
        await refreshUserBalances(user, updateUser);
      } finally {
        setRefreshing(false);
      }
    }
  }, [refreshing, refreshUserBalances]);

  return (
    <Frame>
      <HeaderBar title="Trade" />
      <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }
      >
        <View className="flex-1 gap-4">
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
            youPayValue={parseFloat(amount) || 0}
            youPayToken={selectedToken || possessedTokens[0]}
          />
        </View>
      </ScrollView>
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
