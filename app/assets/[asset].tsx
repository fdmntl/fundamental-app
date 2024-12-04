import { Stack, useLocalSearchParams, Link } from 'expo-router';
import { View } from 'react-native';

import { HeaderBar } from '~/components/HeaderBar';
import { FText } from '~/components/Text/FText';
import { Frame } from '~/components/Wrappers/Frame';

export default function Assets() {
  const { asset } = useLocalSearchParams();
  return (
    <>
      <Stack.Screen options={{ title: 'Asset details', headerShown: false }} />

      <Frame>
        <HeaderBar title="Asset details" />
        <View className="mx-auto mt-60 items-center">
          <FText className="text-2xl">Asset: {asset}</FText>
          <Link href="/assets">
            <FText>Go back</FText>
          </Link>
        </View>
      </Frame>
    </>
  );
}
