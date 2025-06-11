import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { FText } from '../Text/FText';

export const TradeHistoryButton = () => {
  return (
    <TouchableOpacity onPress={() => router.push('/transactionHistory')}>
      <View className="flex-row items-center p-2">
        <View className="flex-row items-center gap-x-2">
          <Feather name="clock" size={22} className="text-neutral" />
          <FText className="!text-2xl !text-neutral" bold>
            See Transaction History
          </FText>
        </View>
        <Feather name="chevron-right" size={24} className="ml-auto text-neutral" />
      </View>
    </TouchableOpacity>
  );
};
