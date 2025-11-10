import { View } from 'react-native';
import { Container } from '~/components/Container';
import { FText } from '~/components/Text/FText';

type EarnStatsProps = {
  totalStakedUSD: number;
  totalGainsUSD: number;
  averageAPY: number;
};

export const EarnStats = ({ totalStakedUSD, totalGainsUSD, averageAPY }: EarnStatsProps) => {
  return (
    <View className="border rounded-xl bg-background p-4 gap-4">
      <View>
        <FText className="text-sm text-neutral">Total Staked Value</FText>
        <FText className="text-3xl" bold>${totalStakedUSD.toFixed(2)}</FText>
      </View>
      <View className="flex-row justify-between">
        <View>
          <FText className="text-sm text-neutral">Total Earnings</FText>
          <FText className="text-xl text-success" bold>+${totalGainsUSD.toFixed(2)}</FText>
        </View>
        <View>
          <FText className="text-sm text-neutral">Avg APY</FText>
          <FText className="text-xl" bold>{averageAPY.toFixed(1)}%</FText>
        </View>
      </View>
    </View>
  );
};