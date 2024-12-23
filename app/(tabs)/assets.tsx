import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { View } from 'react-native';

import Graph from '~/components/Graph';
import { HeaderBar } from '~/components/HeaderBar';
import { FText } from '~/components/Text/FText';
import { FTitle } from '~/components/Text/FTitle';
import { Frame } from '~/components/Wrappers/Frame';
import { useSupabaseSubscription } from '~/services/Supabase/useSupabaseSubscription';
import { DataPoint } from '~/types/data';

export default function Assets() {
  const [allData] = useState<DataPoint[]>([]);
  const data = useSupabaseSubscription({ table: 'token_list' });

  return (
    <Frame>
      <HeaderBar title="Assets" />
      <View>
        <FText>Number of assets: {data.length}</FText>
      </View>
      <View className="">
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
      <Graph allData={allData} />
    </Frame>
  );
}

// // Mock data generation
// const [allData] = useState<DataPoint[]>(
//   Array.from({ length: 365 }, (_, i) => ({
//     value: Math.floor(Math.random() * (2763 - 1000 + 1)) + 1000, // Random price
//     label: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(), // ISO date
//   }))
// );
