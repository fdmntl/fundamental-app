import { Stack, useLocalSearchParams } from 'expo-router';
import { View, ScrollView, TouchableOpacity } from 'react-native';

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
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="gap-y-5 pb-24">
              <Graph
                data={dataForSelectedRange}
                selectedRangeComponent={
                  <View className="mb-2 flex-row justify-around">
                    {['1day', '1week', '1month', '1year'].map((range) => (
                      <TouchableOpacity
                        key={range}
                        onPress={() => setSelectedRange(range as GraphRange)}
                        className={`rounded-xl px-3 py-1 ${
                          selectedRange === range ? 'bg-primary' : ''
                        }`}>
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
              <View>
                <FText bold>About {title}</FText>
                <FText>{token.description}</FText>
              </View>
            </View>
          </ScrollView>
          <AssetDetailsCTAs tokenAddress={token.address} />
        </View>
      </Frame>
    </>
  );
}

/* <View>
<FText>Current Route: {navigationState.routes[navigationState.index].name}</FText>
<FText>All Routes:</FText>
{navigationState.routes.map((route, index) => (
  <FText key={index}>{route.name}</FText>
))}
</View> */
