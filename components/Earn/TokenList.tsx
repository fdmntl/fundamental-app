import { View } from 'react-native';

import { TokenCard } from './TokenCard';
import { LoadingDots } from '../Loading';

import { FText } from '~/components/Text/FText';
import { EarnToken } from '~/types/earn';

type TokenListProps = {
  tokens: EarnToken[];
  onStake: (token: EarnToken) => void;
  onUnstake: (token: EarnToken) => void;
  loading: boolean;
};

export const TokenList = ({ tokens, onStake, onUnstake, loading }: TokenListProps) => {
  if (loading) {
    return (
      <View className="gap-4 p-12">
        <FText className="text-center text-lg text-neutral">Loading tokens</FText>
        <LoadingDots />
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
