import { Feather } from '@expo/vector-icons';
import { View, Image } from 'react-native';

import { Button } from '../Button';

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

  return (
    <View className="rounded-xl border-4 border-content p-4">
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
        <View className="items-end">
          <FText className="text-xl text-success" bold>
            {token.apy.toFixed(1)}% APY
          </FText>
        </View>
      </View>

      <View className="mt-4 gap-2">
        <View className="flex-row justify-between">
          <FText className="text-neutral">Available</FText>
          <FText bold>
            {formatTokenAmount(token.balance, token)} {token.symbol}
          </FText>
        </View>
        <View className="flex-row justify-between">
          <FText className="text-neutral">Staked value</FText>
          <FText bold>${token.value.toFixed(2)}</FText>
        </View>
        {token.staked > 0 && (
          <>
            <View className="bg-neutral/20 my-2 h-px" />
            <View className="flex-row justify-between">
              <FText className="text-neutral">Staked</FText>
              <FText bold>
                {formatTokenAmount(token.staked, token)} {token.symbol}
              </FText>
            </View>
            <View className="flex-row justify-between">
              <FText className="text-neutral">Staked Value</FText>
              <FText bold>${token.stakedValue.toFixed(2)}</FText>
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

      <View className="mt-4 flex justify-around gap-2">
        <Button
          title="Stake"
          onPress={() => onStake(token)}
          icon={<Feather name="download" size={16} className="text-text" />}
          className="w-full bg-content"
          disableGradient
          disabled={!isAvailable}
        />
        <Button
          title="Unstake"
          onPress={() => onUnstake(token)}
          icon={<Feather name="upload" size={16} className="text-text" />}
          className="w-full bg-content"
          disableGradient
          disabled={token.staked === 0}
        />
      </View>
    </View>
  );
};
