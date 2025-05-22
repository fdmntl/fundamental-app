import { Stack, useLocalSearchParams } from 'expo-router';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';

import { AssetDetailsCTAs } from '~/components/Assets/AssetDetailsCTAs';
import { DetailsHeader } from '~/components/Assets/DetailsHeader';
import { Container } from '~/components/Container';
import Graph from '~/components/Graph';
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

  const title = `${capitalise(token.name)}`;
  const icon = tokenIcons[token.symbol];

  // Time range options and labels for the new graph
  const rangeOptions: GraphRange[] = ['1day', '1week', '1month', '1year'];
  const rangeLabels: Record<GraphRange, string> = {
    '1day': '1D',
    '1week': '1W',
    '1month': '1M',
    '1year': '1Y',
  };

  const { selectedRange, setSelectedRange, dataForSelectedRange } = useGraphData({
    daily_values: token.daily_values,
    weekly_values: token.weekly_values,
    monthly_values: token.monthly_values,
    yearly_values: token.yearly_values,
  });

  const userTokenValue = getUserTokenValue(token.address, tokens, user).toFixed(2);
  const userTokenAmount = getUserTokenAmount(token.address, tokens, user);

  return (
    <>
      <Stack.Screen options={{ title, headerShown: false }} />
      <Frame>
        <View className="flex-1">
          <DetailsHeader title={title} icon={icon} />
          <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={scrollEnabled}>
            <View className="gap-y-5 pb-24">
              {/* New Graph Implementation (kept as is) */}
              <View
                onTouchStart={() => setScrollEnabled(false)}
                onTouchEnd={() => setScrollEnabled(true)}
                onTouchCancel={() => setScrollEnabled(true)}>
                <Container noPadding>
                  <Graph
                    data={dataForSelectedRange}
                    selectedRange={selectedRange}
                    selectedRangeComponent={
                      <View className="my-1 flex-row justify-around">
                        {rangeOptions.map((range) => (
                          <TouchableOpacity
                            key={range}
                            onPress={() => setSelectedRange(range)}
                            className={`rounded-lg px-4 py-2 ${
                              selectedRange === range ? 'bg-primary' : ''
                            }`}>
                            <FText
                              className={`${selectedRange === range ? 'text-white' : 'text-text'} !text-base`}
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

              {/* Restored Holdings Section */}
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

              {/* Restored About Section */}
              <View>
                <FText bold>About {title}</FText>
                <FText>{token.description}</FText>
              </View>
            </View>
          </ScrollView>
          {/* AssetDetailsCTAs moved outside ScrollView */}
          <AssetDetailsCTAs tokenAddress={token.address} />
        </View>
      </Frame>
    </>
  );
}
