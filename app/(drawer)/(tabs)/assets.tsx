import { useState, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';

import { AssetListDisplay } from '~/components/Assets/AssetListDisplay';
import { BalanceRefreshControl } from '~/components/BalanceRefreshControl';
import { Container } from '~/components/Container';
import Graph from '~/components/Graph';
import { HeaderBar } from '~/components/HeaderBar';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { GraphRange, graphRangeMap } from '~/types/graph';
import { getUserTokenValue } from '~/utils/helpers/tokens/getUserTokenValue';
import { getUserTokenAmount } from '~/utils/helpers/tokens/getUserTokenAmount';
import { FText } from '~/components/Text/FText';

// TODO: use user balance instead of token list

export default function Assets() {
  // Graph state for selecting timeframe
  const [selectedRange, setSelectedRange] = useState<GraphRange>('1month');
  const { tokens, user } = useAppData();

  // Combine token series into total portfolio value series
  const totalData = useMemo(() => {
    if (!tokens.length) return [];
    const key = graphRangeMap[selectedRange];
    const firstSeries = tokens[0][key] || [];
    const length = firstSeries.length;
    if (length === 0) return [];
    const labels = firstSeries.map((dp) => dp.label);
    const sums = new Array<number>(length).fill(0);
    tokens.forEach((token) => {
      const series = token[key] || [];
      const amount = getUserTokenAmount(token.address, tokens, user);
      for (let i = 0; i < length; i++) {
        sums[i] += (series[i]?.value || 0) * amount;
      }
    });
    return sums.map((value, i) => ({ value, label: labels[i] }));
  }, [tokens, user, selectedRange]);

  const stableCoins = tokens.filter((item) => item.is_stablecoin);
  const cryptos = tokens.filter((item) => !item.is_stablecoin);

  return (
    <Frame>
      <HeaderBar title="Assets" />
      <BalanceRefreshControl>
        <View className="flex gap-y-5">
          <Graph
            data={totalData}
            selectedRangeComponent={
              <View className="mb-2 flex-row justify-around">
                {['1day', '1week', '1month', '1year'].map((range) => (
                  <TouchableOpacity
                    key={range}
                    onPress={() => setSelectedRange(range as GraphRange)}
                    className={`rounded-xl px-3 py-1 ${selectedRange === range ? 'bg-primary' : ''}`}>
                    <FText
                      className={`${selectedRange === range ? 'text-white' : 'text-text'}`}
                      bold>
                      {range.toUpperCase()}
                    </FText>
                  </TouchableOpacity>
                ))}
              </View>
            }
          />
          <Container title="Money">
            <View className="flex gap-y-4">
              {stableCoins
                .sort(
                  (a, b) =>
                    getUserTokenValue(b.address, tokens, user) -
                    getUserTokenValue(a.address, tokens, user)
                )
                .map((item) => (
                  <AssetListDisplay key={item.address} token={item} />
                ))}
            </View>
          </Container>
          <Container title="Crypto">
            <View className="flex gap-y-4">
              {cryptos
                .sort(
                  (a, b) =>
                    getUserTokenValue(b.address, tokens, user) -
                    getUserTokenValue(a.address, tokens, user)
                )
                .map((item) => (
                  <AssetListDisplay key={item.address} token={item} />
                ))}
            </View>
          </Container>
        </View>
      </BalanceRefreshControl>
    </Frame>
  );
}
