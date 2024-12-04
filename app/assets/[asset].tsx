import { Stack, useLocalSearchParams, Link } from 'expo-router';
import { View } from 'react-native';

import { HeaderBar } from '~/components/HeaderBar';
import { FText } from '~/components/Text/FText';
import { Frame } from '~/components/Wrappers/Frame';
import { capitalise } from '~/utils/helpers/strings/capitalise';

export default function Assets() {
  const { asset } = useLocalSearchParams();
  const title = `${capitalise(asset as string)} details`;
  return (
    <>
      <Stack.Screen options={{ title, headerShown: false }} />
      <Frame>
        <HeaderBar title={title} />
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
