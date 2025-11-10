import { View } from 'react-native';
import { EarnToken } from '~/types/earn';
import { TokenCard } from './TokenCard';
import { User,Token } from '~/types/supabaseTypes';
import { digitsToAmount } from '~/utils/helpers/tokens/digitsToAmount';
type TokenListProps = {
  tokens: Token[];
  user: User;
  onStake: (token: EarnToken) => void;
  onUnstake: (token: EarnToken) => void;
};

export const TokenList = ({ tokens, user, onStake, onUnstake }: TokenListProps) => {
  // Transforme chaque Token en EarnToken en combinant avec la balance de l'user
  const earnTokens: EarnToken[] = tokens.map(token => {
    //log userBalance
    const userBalance = user.balances.find(
      b => b.address.toLowerCase() === token.address.toLowerCase()
    );

    const balance = digitsToAmount(userBalance?.balance || 0, token);
    const value = userBalance?.value || 0;
    return {
      ...token,
      balance,
      value,
      staked: 0, // à remplir si tu récupères les stakes
      stakedValue: 0, // à calculer
      gains: 0, // à remplir selon ton historique
      gainsValue: 0, // à calculer
    };
  });

  return (
    <View className="gap-5">
      {earnTokens.map(token => (
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