import { View } from 'react-native';

import { FText } from '~/components/Text/FText';

type EarnStatsProps = {
  totalStakedUSD: number;
  totalGainsUSD: number;
  averageAPY: number;
};

export const EarnStats = ({ totalStakedUSD, totalGainsUSD, averageAPY }: EarnStatsProps) => {
  return (
    <View className="gap-2">
      <View className="gap-1">
        <FText className="text-sm text-neutral">Total Staked Value</FText>
        <FText className="text-4xl" bold>
          ${totalStakedUSD.toFixed(2)}
        </FText>
      </View>
      <View className="flex-row justify-between">
        <View>
          <FText className="text-sm text-neutral">Total Earnings</FText>
          <FText className="text-2xl text-success" bold>
            +${totalGainsUSD.toFixed(2)}
          </FText>
        </View>
        <View>
          <FText className="ml-auto text-sm text-neutral">Avg APY</FText>
          <FText className="text-2xl" bold>
            {averageAPY.toFixed(1)}%
          </FText>
        </View>
      </View>
    </View>
  );
};
