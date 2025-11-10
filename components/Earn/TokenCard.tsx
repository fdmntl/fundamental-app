import { View, TouchableOpacity } from 'react-native';
import { FText } from '~/components/Text/FText';
import { EarnToken } from '~/types/earn';
import { formatTokenAmount } from '~/utils/earn.utils';

type TokenCardProps = {
  token: EarnToken;
  onStake: (token: EarnToken) => void;
  onUnstake: (token: EarnToken) => void;
};

export const TokenCard = ({ token, onStake, onUnstake }: TokenCardProps) => {
  const getTokenIcon = (symbol: string) => {
    const icons: { [key: string]: string } = {
      'ETH': '◆',
      'WETH': '◆',
      'USDC': '$',
      'USDT': '$',
      'DAI': '$',
      'WBTC': '₿',
      'BTC': '₿',
      'cbBTC': '₿',
    };
    return icons[symbol] || '🪙';
  };

  return (
    <View className="rounded-xl bg-content p-4">
      {/* En-tête du token */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/20">
            <FText className="text-2xl">{getTokenIcon(token.symbol)}</FText>
          </View>
          <View>
            <FText className="text-lg" bold>{token.symbol}</FText>
            <FText className="text-sm text-neutral">{token.name}</FText>
          </View>
        </View>
        <View className="items-end">
          <View className="rounded-full bg-success/20 px-3 py-1">
            <FText className="text-success" bold>{token.apy.toFixed(1)}% APY</FText>
          </View>
        </View>
      </View>

      {/* Balances */}
      <View className="mt-4 gap-2">
        <View className="flex-row justify-between">
          <FText className="text-neutral">Available</FText>
          <FText bold>
            {formatTokenAmount(token.balance, token)} {token.symbol}
          </FText>
        </View>
        <View className="flex-row justify-between">
          <FText className="text-neutral">Value</FText>
          <FText bold>
            ${(token.balance * token.last_value).toFixed(2)}
          </FText>
        </View>
        {token.staked > 0 && (
          <>
            <View className="my-2 h-px bg-neutral/20" />
            <View className="flex-row justify-between">
              <FText className="text-neutral">Staked</FText>
              <FText bold>
                {formatTokenAmount(token.staked, token)} {token.symbol}
              </FText>
            </View>
            <View className="flex-row justify-between">
              <FText className="text-neutral">Staked Value</FText>
              <FText bold>
                ${token.stakedValue.toFixed(2)}
              </FText>
            </View>
            <View className="flex-row justify-between">
              <FText className="text-neutral">Earnings</FText>
              <FText className="text-success" bold>
                +{token.gains.toFixed(2)}% (${token.gainsValue.toFixed(2)})
              </FText>
            </View>
          </>
        )}
      </View>

      {/* Boutons d'action */}
      <View className="mt-4 flex-row gap-2">
        <TouchableOpacity
          onPress={() => onStake(token)}
          disabled={token.balance === 0}
          className={`flex-1 rounded-lg py-3 ${
            token.balance === 0 ? 'bg-neutral/20' : 'bg-primary'
          }`}>
          <FText className={`text-center ${token.balance === 0 ? 'text-neutral' : 'text-white'}`} bold>
            Stake
          </FText>
        </TouchableOpacity>
        {token.staked > 0 && (
          <TouchableOpacity
            onPress={() => onUnstake(token)}
            className="flex-1 rounded-lg border-2 border-primary py-3">
            <FText className="text-center text-primary" bold>
              Unstake
            </FText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};