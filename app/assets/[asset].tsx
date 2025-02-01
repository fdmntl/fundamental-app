import { Feather } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { View, ScrollView } from 'react-native';

import { AssetDetailsCTAs } from '~/components/Assets/AssetDetailsCTAs';
import { DetailsHeader } from '~/components/Assets/DetailsHeader';
import { Container } from '~/components/Container';
import Graph from '~/components/Graph';
import { FText } from '~/components/Text/FText';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { tokenIcons } from '~/utils/helpers/mappings/tokenIcons';
import { capitalise } from '~/utils/helpers/strings/capitalise';
import { getUserTokenAmount } from '~/utils/helpers/tokens/getUserTokenAmount';
import { getUserTokenValue } from '~/utils/helpers/tokens/getUserTokenValue';

export default function Assets() {
  const { asset } = useLocalSearchParams();

  const { getToken } = useAppData();
  const token = getToken(asset as string);

  const { tokens, user } = useAppData();

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

  const userTokenValue = getUserTokenValue(token.address, tokens, user).toFixed(2);
  const userTokenAmount = getUserTokenAmount(token.address, tokens, user);

  const actualValue = token.last_value;

  const roundedValue = actualValue.toFixed(2);

  // TODO: fix this (graph)
  // const tokenHistory = token.value
  //   .map((item) => {
  //     return {
  //       value: parseFloat(item.value),
  //       label: item.timestamp,
  //     };
  //   })
  //   .reverse();

  return (
    <>
      <Stack.Screen options={{ title, headerShown: false }} />
      <Frame>
        <View className="flex-1">
          <DetailsHeader title={title} icon={icon} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="gap-y-5">
              <View className="flex flex-row items-center justify-center gap-x-2">
                <FText className="!text-4xl" bold>
                  ${roundedValue}
                </FText>
                <Feather name="trending-up" size={30} className="text-success" />
              </View>
              {/* <Graph allData={tokenHistory} /> */}
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
