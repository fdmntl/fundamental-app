import { Feather } from '@expo/vector-icons';
import { View } from 'react-native';

import { HeaderBar } from '~/components/HeaderBar';
import { FText } from '~/components/Text/FText';
import { FTitle } from '~/components/Text/FTitle';
import { Frame } from '~/components/Wrappers/Frame';
import { useSupabaseSubscription } from '~/services/Supabase/useSupabaseSubscription';

export default function Assets() {
  const data = useSupabaseSubscription({ table: 'token_list' });

  return (
    <Frame>
      <HeaderBar title="Assets" />
      <View>
        <FText>Number of assets: {data.length}</FText>
      </View>
      <View className="mx-auto mt-60 items-center">
        {data.map((item) => {
          return (
            <View key={item.address} className="flex items-center">
              <Feather name="cpu" size={24} color="black" />
              <FTitle>{item.name}</FTitle>
              <FText>{item.symbol}</FText>
              <FText>{item.description}</FText>
            </View>
          );
        })}
      </View>
    </Frame>
  );
}
