import { Link, Stack } from 'expo-router';
import { Image, View } from 'react-native';

import FText from '~/components/Text/FText';

const fundyGoofy = require('../assets/fundyGoofy.png');

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Oops!',
          headerStyle: { backgroundColor: '#8720FE' },
          headerTitleStyle: {
            color: 'white',
          },
          headerTintColor: 'white',
          headerShadowVisible: false,
        }}
      />
      <View className="flex flex-1 items-center bg-primary">
        <View className="mx-auto mt-60 items-center">
          <Image source={fundyGoofy} style={{ height: 64, width: 96 }} resizeMode="contain" />
          <FText bold>This screen doesn't exist.</FText>
          <Link href="/" className="mt-2">
            <FText medium italic>
              Go to home screen!
            </FText>
          </Link>
        </View>
      </View>
    </>
  );
}
