import { Feather } from '@expo/vector-icons';
import { View, Image } from 'react-native';

import { Button } from '../Button';
import { useTheme } from '../Wrappers/ThemeWrapper';

import { FText } from '~/components/Text/FText';
import { EarnToken } from '~/types/earn';
import { formatTokenAmount } from '~/utils/earn.utils';
import { tokenIcons } from '~/utils/helpers/mappings/tokenIcons';

type TokenCardProps = {
  token: EarnToken;
  onStake: (token: EarnToken) => void;
  onUnstake: (token: EarnToken) => void;
};

export const TokenCard = ({ token, onStake, onUnstake }: TokenCardProps) => {
  const icon = tokenIcons[token.symbol];
  const isAvailable = token.balance > 0;
  const { theme } = useTheme();

  return (
    <View
      className={`rounded-xl border-4 p-4 ${
        theme === 'dark' ? 'border-content bg-background' : 'border-background bg-content'
      }`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="bg-primary/20 h-12 w-12 items-center justify-center rounded-full">
            <Image source={icon} style={{ height: 40, width: 40 }} />
          </View>
          <View>
            <FText className="text-lg" bold>
              {token.symbol}
            </FText>
            <FText className="text-sm text-neutral">{token.name}</FText>
          </View>
        </View>
        <View className="rounded-xl bg-success-secondary px-2 py-0.5">
          <FText className="text-lg text-success" bold>
            {token.apy.toFixed(1)}% APY
          </FText>
        </View>
      </View>

      <View className="mt-4 gap-4">
        <View className="gap-2">
          <View className="flex-row justify-between">
            <FText className="text-neutral">Available</FText>
            <FText bold>
              {formatTokenAmount(token.balance, token)} {token.symbol}
            </FText>
          </View>
          <View className="flex-row justify-between">
            <FText className="text-neutral">Value</FText>
            <FText bold>${token.value.toFixed(2)}</FText>
          </View>
        </View>
        {token.staked > 0 && (
          <View
            className={`gap-2 rounded-xl border-4 px-3 py-2 ${
              theme === 'dark' ? 'border-content' : 'border-background'
            }`}>
            <View
              className={`flex-row justify-between border-b-2 pb-2 ${
                theme === 'dark' ? 'border-content' : 'border-background'
              }`}>
              <View className="flex flex-row items-center gap-2">
                <Feather name="archive" size={14} className="text-neutral" />
                <FText className="text-neutral">Staked Amount</FText>
              </View>
              <FText bold>
                {formatTokenAmount(token.staked, token)} {token.symbol}
              </FText>
            </View>
            <View
              className={`flex-row justify-between border-b-2 pb-2 ${
                theme === 'dark' ? 'border-content' : 'border-background'
              }`}>
              <View className="flex flex-row items-center gap-2">
                <Feather name="trending-up" size={14} className="text-neutral" />
                <FText className="text-neutral">Staked Value</FText>
              </View>
              <FText bold>${token.stakedValue.toFixed(2)}</FText>
            </View>
            <View className="flex-row justify-between">
              <View className="flex flex-row items-center gap-2">
                <Feather name="percent" size={14} className="text-neutral" />
                <FText className="text-neutral">Earnings</FText>
              </View>
              <FText className="text-success" bold>
                +{token.gains.toFixed(2)}% (${token.gainsValue.toFixed(2)})
              </FText>
            </View>
          </View>
        )}
      </View>

      <View className="mt-4 flex justify-around gap-2">
        <Button
          title="Stake"
          onPress={() => onStake(token)}
          icon={<Feather name="download" size={16} className="text-text" />}
          className={`w-full ${theme === 'dark' ? 'bg-content' : 'bg-background'}`}
          disableGradient
          disabled={!isAvailable}
        />
        <Button
          title="Unstake"
          onPress={() => onUnstake(token)}
          icon={<Feather name="upload" size={16} className="text-text" />}
          className={`w-full ${theme === 'dark' ? 'bg-content' : 'bg-background'}`}
          disableGradient
          disabled={token.staked === 0}
        />
      </View>
    </View>
  );
};
