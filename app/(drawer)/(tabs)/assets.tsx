import { useState, useMemo, useCallback } from 'react';
import { View } from 'react-native';

import { AssetListDisplay } from '~/components/Assets/AssetListDisplay';
import { BalanceRefreshControl } from '~/components/BalanceRefreshControl';
import { Container } from '~/components/Container';
import Graph from '~/components/Graph';
import { GraphRangeSelector } from '~/components/Graph/GraphRangeSelector';
import { HeaderBar } from '~/components/HeaderBar';
import { TradeHistoryButton } from '~/components/Transaction/TradeHistoryButton';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { refreshUserBalances } from '~/services/refreshUserBalance';
import { GraphRange, graphRangeMap } from '~/types/graph';
import { getUserTokenAmount } from '~/utils/helpers/tokens/getUserTokenAmount';
import { getUserTokenValue } from '~/utils/helpers/tokens/getUserTokenValue';

// TODO: use user balance instead of token list

export default function Assets() {
  // Graph state for selecting timeframe
  const [selectedRange, setSelectedRange] = useState<GraphRange>('1month');
  // Disable scroll when interacting with the chart
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const { tokens, user, updateUser } = useAppData();
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
    if (length === 0) return []; // Return empty if no historical data
    const labels = firstSeries.map((dp) => dp.label);
    const sums = new Array<number>(length).fill(0);
    tokens.forEach((token) => {
      const series = token[key] || [];
      const amount = getUserTokenAmount(token.address, tokens, user);
      for (let i = 0; i < length; i++) {
        sums[i] += (series[i]?.value || 0) * amount;
      }
    });

    // Calculate the combined latest value
    let combinedLatestValue = 0;
    tokens.forEach((token) => {
      if (typeof token.last_value === 'number') {
        const amount = getUserTokenAmount(token.address, tokens, user);
        combinedLatestValue += token.last_value * amount;
      }
    });

    const historicalData = sums.map((value, i) => ({ value, label: labels[i] }));

    // Add the combined latest value as a new data point
    const now = new Date();
    // Format label as ISO string to be consistent with historical data
    const currentTimeLabel = now.toISOString();

    return [...historicalData, { value: combinedLatestValue, label: currentTimeLabel }];
  }, [tokens, user, selectedRange]);

  const stableCoins = tokens.filter((item) => item.is_stablecoin);
  const cryptos = tokens.filter((item) => !item.is_stablecoin);

  const onBalanceRefresh = useCallback(async () => {
    if (!user) {
      console.warn('no user, skipping');
      return;
    }
    await refreshUserBalances(user, updateUser);
  }, [user, updateUser]);

  return (
    <Frame>
      <HeaderBar title="Assets" />
      <BalanceRefreshControl scrollEnabled={scrollEnabled} onRefresh={onBalanceRefresh}>
        <View className="flex gap-y-5">
          <View
            onTouchStart={() => setScrollEnabled(false)}
            onTouchEnd={() => setScrollEnabled(true)}
            onTouchCancel={() => setScrollEnabled(true)}>
            <Container noPadding>
              <Graph
                data={totalData}
                selectedRange={selectedRange}
                selectedRangeComponent={
                  <GraphRangeSelector
                    rangeOptions={rangeOptions}
                    selectedRange={selectedRange}
                    onSelectRange={setSelectedRange}
                    rangeLabels={rangeLabels}
                  />
                }
              />
            </Container>
          </View>
          <TradeHistoryButton />
          <Container title="Money" titleAbove>
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
          <Container title="Crypto" titleAbove>
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
