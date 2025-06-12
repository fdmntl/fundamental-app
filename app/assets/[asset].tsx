import { Stack, useLocalSearchParams } from 'expo-router';
import { useState, useMemo } from 'react';
import { View, ScrollView } from 'react-native';

import { AssetDetailsCTAs } from '~/components/Assets/AssetDetailsCTAs';
import { DetailsHeader } from '~/components/Assets/DetailsHeader';
import { Container } from '~/components/Container';
import Graph from '~/components/Graph';
import { GraphRangeSelector } from '~/components/Graph/GraphRangeSelector';
import { FText } from '~/components/Text/FText';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { useGraphData } from '~/hooks/useGraphData';
import { GraphRange } from '~/types/graph';
import { tokenIcons } from '~/utils/helpers/mappings/tokenIcons';
import { capitalise } from '~/utils/helpers/strings/capitalise';
import { getUserTokenAmount } from '~/utils/helpers/tokens/getUserTokenAmount';
import { getUserTokenValue } from '~/utils/helpers/tokens/getUserTokenValue';

export default function Assets() {
  // disable outer scroll when interacting with chart
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const { asset } = useLocalSearchParams();

  const { tokens, user } = useAppData();

  const { getToken } = useAppData();
  const token = getToken(asset as string);

  // Prepare hooks and variables for both cases
  const title = token ? `${capitalise(token.name)}` : '';
  const icon = token ? tokenIcons[token.symbol] : undefined;

  const rangeOptions: GraphRange[] = ['1day', '1week', '1month', '1year'];
  const rangeLabels: Record<GraphRange, string> = {
    '1day': '1D',
    '1week': '1W',
    '1month': '1M',
    '1year': '1Y',
  };

  const { selectedRange, setSelectedRange, dataForSelectedRange } = useGraphData(token);

  const userTokenValue = token ? getUserTokenValue(token.address, tokens, user).toFixed(2) : '0.00';
  const userTokenAmount = token ? getUserTokenAmount(token.address, tokens, user) : 0;

  const graphDataWithCurrent = useMemo(() => {
    if (!token) return [];
    const processedData = Array.isArray(dataForSelectedRange) ? [...dataForSelectedRange] : [];
    if (typeof token.last_value === 'number') {
      const now = new Date();
      const currentTimeLabel = now.toISOString();
      processedData.push({ value: token.last_value, label: currentTimeLabel });
    }
    return processedData;
  }, [dataForSelectedRange, token]);

  if (!token) {
    return (
      <Frame>
        <DetailsHeader title="Token not found" />
        <View className="flex h-64 items-center justify-center">
          <FText>This token is not supported</FText>
        </View>
      </Frame>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title, headerShown: false }} />
      <Frame disableBottomPadding>
        <View className="flex-1">
          <DetailsHeader title={title} icon={icon} />
          <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={scrollEnabled}>
            <View className="gap-y-5 pb-24">
              <View
                onTouchStart={() => setScrollEnabled(false)}
                onTouchEnd={() => setScrollEnabled(true)}
                onTouchCancel={() => setScrollEnabled(true)}>
                <Container noPadding>
                  <Graph
                    data={graphDataWithCurrent}
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
              <Container title="Holdings">
                <View className="flex flex-row items-center justify-between">
                  <View>
                    <FText bold className="!text-2xl">
                      ${userTokenValue}
                    </FText>
                    {!token.is_stablecoin && (
                      <FText className="!text-base">
                        {userTokenAmount} {token.symbol}
                      </FText>
                    )}
                  </View>
                  <FText bold>Total amount</FText>
                </View>
              </Container>
              <AssetDetailsCTAs tokenAddress={token.address} />
              <View>
                <FText bold>About {title}</FText>
                <FText>{token.description}</FText>
              </View>
            </View>
          </ScrollView>
        </View>
      </Frame>
    </>
  );
}
