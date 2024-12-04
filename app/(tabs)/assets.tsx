import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View } from 'react-native';

import { Button } from '~/components/Button';
import { HeaderBar } from '~/components/HeaderBar';
import { FText } from '~/components/Text/FText';
import { Frame } from '~/components/Wrappers/Frame';

export default function Assets() {
  return (
    <Frame>
      <HeaderBar title="Assets" />
      <View className="mx-auto mt-60 items-center">
        <Feather name="package" size={64} className="text-text" />
        <FText className="text-2xl">Under construction</FText>
        <View className="mt-5">
          <Button
            title="Bitcoin Asset"
            onPress={() => {
              router.push('/assets/bitcoin');
            }}
          />
        </View>
      </View>
    </Frame>
  );
}
