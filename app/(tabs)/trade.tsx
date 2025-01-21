import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { HeaderBar } from '~/components/HeaderBar';
import { AmountInput } from '~/components/Send/AmountInput';
import { FText } from '~/components/Text/FText';
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
      <View className="flex-1 gap-4">
        <TouchableOpacity>
          <View className="flex flex-row items-center">
            <Feather name="clock" size={24} className="text-neutral" />
            <FText bold className="ml-2 !text-2xl !text-neutral">
              See your transaction history
            </FText>
            <Feather name="chevron-right" size={28} className="ml-auto text-neutral" />
          </View>
        </TouchableOpacity>
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
