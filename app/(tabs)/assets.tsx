import { Feather } from '@expo/vector-icons';
import { View } from 'react-native';

import { HeaderBar } from '~/components/HeaderBar';
import { FText } from '~/components/Text/FText';
import { Frame } from '~/components/Wrappers/Frame';
import TestModule from '~/components/TestModule';

export default function Assets() {
  return (
    <Frame>
      <HeaderBar title="Assets" />
      <View className="mx-auto mt-60 items-center">
        <TestModule/>
      </View>
    </Frame>
  );
}
