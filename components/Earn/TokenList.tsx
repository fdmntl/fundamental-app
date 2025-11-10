import { View } from 'react-native';
import { EarnToken } from '~/types/earn';
import { TokenCard } from './TokenCard';

type TokenListProps = {
  tokens: EarnToken[];
  onStake: (token: EarnToken) => void;
  onUnstake: (token: EarnToken) => void;
};

export const TokenList = ({ tokens, onStake, onUnstake }: TokenListProps) => {
  return (
    <View className="gap-5">
    {tokens.map((token) => (
        token.apy > 0 && (
        <TokenCard
            key={token.address}
            token={token}
            onStake={onStake}
            onUnstake={onUnstake}
        />
        )
    ))}
    </View>
  );
};