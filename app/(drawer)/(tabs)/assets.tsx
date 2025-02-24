import { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import React from 'react';

import { AssetListDisplay } from '~/components/Assets/AssetListDisplay';
import { Container } from '~/components/Container';
import Graph from '~/components/Graph';
import { HeaderBar } from '~/components/HeaderBar';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { DataPoint, GraphData } from '~/types/graph';
import { BalanceRefreshControl } from '~/components/BalanceRefreshControl';

// TODO: use user balance instead of token list

export default function Assets() {
  const [allData] = useState<GraphData | undefined>();
  const { tokens } = useAppData();

  const stableCoins = tokens.filter((item) => item.is_stablecoin);
  const cryptos = tokens.filter((item) => !item.is_stablecoin);

  return (
    <Frame>
      <HeaderBar title="Assets" />
      <BalanceRefreshControl>
        <View className="flex gap-y-5">
          <Graph graphData={allData} />
          <Container title="Money">
            <View className="flex gap-y-4">
              {stableCoins.map((item) => (
                <AssetListDisplay key={item.address} token={item} />
              ))}
            </View>
          </Container>
          <Container title="Crypto">
            <View className="flex gap-y-4">
              {cryptos.map((item) => (
                <AssetListDisplay key={item.address} token={item} />
              ))}
            </View>
          </Container>
        </View>
      </BalanceRefreshControl>
    </Frame>
  );
}
