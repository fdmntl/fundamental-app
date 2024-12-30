import { Feather } from '@expo/vector-icons';
import { View } from 'react-native';

import { HeaderBar } from '~/components/HeaderBar';
import { FText } from '~/components/Text/FText';
import { Frame } from '~/components/Wrappers/Frame';

import TestModule from '~/components/TestModule';

export default function Earn() {
  return (
    <Frame>
      <HeaderBar title="Earn" />
      <View className="mx-auto items-center">
        <TestModule />
      </View>
    </Frame>
  );
}
