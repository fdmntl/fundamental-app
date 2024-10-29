import { Feather } from '@expo/vector-icons';
import { View } from 'react-native';

import HeaderBar from '~/components/HeaderBar';
import FText from '~/components/Text/FText';
import { Frame } from '~/components/Wrappers/Frame';

import RecipientInput from '~/components/Send/RecipientInput';
import AmountInput from '~/components/Send/AmountInput';

export default function Send() {
  return (
    <Frame>
      <HeaderBar title="Send" />
      <View>
        <RecipientInput />
      </View>
      <View>
        <AmountInput />
      </View>
    </Frame>
  );
}
