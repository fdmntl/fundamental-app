import { View } from 'react-native';
import { Container } from '~/components/Container';
import { EarnToken } from '~/types/earn';
import { TokenCard } from './TokenCard';

type TokenListProps = {
  tokens: EarnToken[];
  onStake: (token: EarnToken) => void;
  onUnstake: (token: EarnToken) => void;
};

export const TokenList = ({ tokens, onStake, onUnstake }: TokenListProps) => {
  return (
    <View className="px-4 pb-8 gap-3">
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