import { useState, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native';

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
  // Disable scroll when interacting with the chart
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const { tokens, user } = useAppData();
  // Time range options and labels
  const rangeOptions: GraphRange[] = ['1day', '1week', '1month', '1year'];
  const rangeLabels: Record<GraphRange, string> = {
    '1day': '1D',
    '1week': '1W',
    '1month': '1M',
    '1year': '1Y',
  };

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
      <BalanceRefreshControl scrollEnabled={scrollEnabled}>
        <View className="flex gap-y-5">
          <View
            onTouchStart={() => setScrollEnabled(false)}
            onTouchEnd={() => setScrollEnabled(true)}
            onTouchCancel={() => setScrollEnabled(true)}>
            <Container>
              <Graph
                data={totalData}
                selectedRange={selectedRange}
                selectedRangeComponent={
                  <View className="my-1 flex-row justify-around">
                    {rangeOptions.map((range) => (
                      <TouchableOpacity
                        key={range}
                        onPress={() => setSelectedRange(range)}
                        className={`rounded-lg px-3 py-1 ${selectedRange === range ? 'bg-primary' : ''}`}>
                        <FText
                          className={`${selectedRange === range ? 'text-white' : 'text-text'} !text-sm`}
                          bold>
                          {rangeLabels[range]}
                        </FText>
                      </TouchableOpacity>
                    ))}
                  </View>
                }
              />
            </Container>
          </View>
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
