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
import { DataPoint } from '~/types/data';
import { useAppData } from '~/components/Wrappers/AppData';

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
          <View>
            <FText>Number of assets: {tokens.length}</FText>
          </View>
          <View className="">
            {tokens.map((item) => (
              <View key={item.address} className="flex items-center">
                <Feather name="cpu" size={24} className="text-text" />
                <FTitle>{item.name}</FTitle>
                <FText>{item.symbol}</FText>
                <FText>{item.description}</FText>
              </View>
            ))}
          </View>
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
