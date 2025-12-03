import { View } from 'react-native';

import { TokenCard } from './TokenCard';
import {FText} from '~/components/Text/FText';
import { EarnToken } from '~/types/earn';
import { User, Token } from '~/types/supabaseTypes';
import { digitsToAmount } from '~/utils/helpers/tokens/digitsToAmount';
type TokenListProps = {
  tokens: Token[];
  user: User;
  onStake: (token: EarnToken) => void;
  onUnstake: (token: EarnToken) => void;
  loading: boolean;
};

export const TokenList = ({ tokens, user, onStake, onUnstake, loading }: TokenListProps) => {
  // Transform each Token into EarnToken by combining with the user's balance
  if (loading) {
    return (
      <View className="gap-6">
        <FText className="text-center text-neutral">Loading tokens...</FText>
      </View>
    );
  }
  const earnTokens: EarnToken[] = tokens.map((token) => {
    const userBalance = user.balances.find(
      (b) => b.address.toLowerCase() === token.address.toLowerCase()
    );

    const balance = digitsToAmount(userBalance?.balance || 0, token);
    const value = userBalance?.value || 0;
    return {
      ...token,
      balance,
      value,
      staked: 0, // to fill in if you retrieve stakes
      stakedValue: 0, // to calculate
      gains: 0, // to fill in based on your history
      gainsValue: 0, // to calculate
    };
  });

  return (
    <View className="gap-6">
      {earnTokens.map(
        (token) =>
          token.apy > 0 && (
            <TokenCard key={token.address} token={token} onStake={onStake} onUnstake={onUnstake} />
          )
      )}
    </View>
  );
};
