import { Stack, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { DetailsHeader } from '~/components/Assets/DetailsHeader';
import { FText } from '~/components/Text/FText';
import { Frame } from '~/components/Wrappers/Frame';
import { capitalise } from '~/utils/helpers/strings/capitalise';

// TODO: Match user asset to token list entry and display graph + bio

export default function Assets() {
  const { asset } = useLocalSearchParams();
  const title = `${capitalise(asset as string)}`;

  return (
    <>
      <Stack.Screen options={{ title, headerShown: false }} />
      <Frame>
        <DetailsHeader title={title} />
        <View className="mx-auto mt-60 items-center">
          <FText className="text-2xl">Asset: {asset}</FText>
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
