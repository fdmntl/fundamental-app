import { Stack, useLocalSearchParams, Link } from 'expo-router';
import { View } from 'react-native';

import FText from '~/components/Text/FText';
import { Frame } from '~/components/Wrappers/Frame';

export default function Details() {
  const { name } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen options={{ title: 'Details', headerShown: false }} />
      <Frame>
        <View>
          <FText className="text-2xl">Details for {name}</FText>

          <Link href="/">
            <FText>Go back</FText>
          </Link>
        </View>
      </Frame>
    </>
  );
}
