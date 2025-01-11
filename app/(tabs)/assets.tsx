import { useState } from 'react';
import { View, ScrollView } from 'react-native';

import { AssetListDisplay } from '~/components/Assets/AssetListDisplay';
import { Container } from '~/components/Container';
import Graph from '~/components/Graph';
import { HeaderBar } from '~/components/HeaderBar';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { DataPoint } from '~/types/graph';

// TODO: use user balance instead of token list

export default function Assets() {
  const [allData] = useState<DataPoint[]>([]);
  const { tokens } = useAppData();

  const stableCoins = tokens.filter((item) => item.is_stablecoin);
  const cryptos = tokens.filter((item) => !item.is_stablecoin);

  return (
    <Frame>
      <HeaderBar title="Assets" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex gap-y-5">
          <Graph allData={allData} />
          <Container title="Money">
            <View className="flex gap-y-3">
              {stableCoins.map((item) => (
                <AssetListDisplay key={item.address} token={item} />
              ))}
            </View>
          </Container>
          <Container title="Crypto">
            {cryptos.map((item) => (
              <AssetListDisplay key={item.address} token={item} />
            ))}
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
