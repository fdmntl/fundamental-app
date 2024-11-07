import { Feather } from '@expo/vector-icons';
import { View } from 'react-native';

import { HeaderBar } from '~/components/HeaderBar';
import FText from '~/components/Text/FText';
import { Frame } from '~/components/Wrappers/Frame';

export default function Send() {
  return (
    <Frame>
      <HeaderBar title="Send" />
      <View className="mx-auto mt-60 items-center">
        <Feather name="package" size={64} className="text-text" />
        <FText className="text-2xl">Under construction</FText>
      </View>
    </Frame>
  );
}
