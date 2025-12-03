import { View } from 'react-native';

import { TokenCard } from './TokenCard';
import {FText} from '~/components/Text/FText';
import { EarnToken } from '~/types/earn';
import { User, Token } from '~/types/supabaseTypes';
import { digitsToAmount } from '~/utils/helpers/tokens/digitsToAmount';
type TokenListProps = {
  tokens: EarnToken[];
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

  return (
    <View className="gap-6">
      {tokens.map(
        (token) =>
          token.apy > 0 && (
            <TokenCard key={token.address} token={token} onStake={onStake} onUnstake={onUnstake} />
          )
      )}
    </View>
  );
};
