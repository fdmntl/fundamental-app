import { Feather } from '@expo/vector-icons';
import { View } from 'react-native';

import { HeaderBar } from '~/components/HeaderBar';
import TestModule from '~/components/TestModule';
import OnRamping from '~/components/on-ramping';
import { FText } from '~/components/Text/FText';
import { Frame } from '~/components/Wrappers/Frame';

export default function Earn() {
  return (
    <Frame>
      <HeaderBar title="Earn" />
      <View className="mx-auto items-center">
        {/* <TestModule /> */}
        <OnRamping />
      </View>
    </Frame>
  );
}
