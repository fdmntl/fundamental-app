import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { View, ScrollView } from 'react-native';

import { AssetListDisplay } from '~/components/Assets/AssetListDisplay';
import { Container } from '~/components/Container';
import Graph from '~/components/Graph';
import { HeaderBar } from '~/components/HeaderBar';
import { FText } from '~/components/Text/FText';
import { FTitle } from '~/components/Text/FTitle';
import { Frame } from '~/components/Wrappers/Frame';
import { useSupabaseSubscription } from '~/services/Supabase/useSupabaseSubscription';
import { DataPoint } from '~/types/data';
import { TokenList } from '~/types/supabaseTypes';

// TOOD: use user balance instead of token list

export default function Assets() {
  const [allData] = useState<DataPoint[]>([]);
  const data: TokenList = useSupabaseSubscription({ table: 'token_list' });

  const stableCoins = data.filter((item) => item.is_stablecoin);
  const cryptos = data.filter((item) => !item.is_stablecoin);

  return (
    <Frame>
      <HeaderBar title="Assets" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex gap-y-5">
          <Graph allData={allData} />
          <Container title="Money">
            <View className="flex gap-y-3">
              {stableCoins.map((item) => {
                return <AssetListDisplay key={item.address} token={item} />;
              })}
            </View>
          </Container>
          <Container title="Crypto">
            {cryptos.map((item) => {
              return <AssetListDisplay key={item.address} token={item} />;
            })}
          </Container>
        </View>
      </ScrollView>
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
