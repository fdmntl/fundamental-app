import { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl} from 'react-native';
import React from 'react';

import { AssetListDisplay } from '~/components/Assets/AssetListDisplay';
import { Container } from '~/components/Container';
import Graph from '~/components/Graph';
import { HeaderBar } from '~/components/HeaderBar';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';
import { DataPoint, GraphData } from '~/types/graph';
import { refreshUserBalances } from '~/services/refreshUserBalance';

// TODO: use user balance instead of token list

export default function Assets() {
  const [allData] = useState<GraphData | undefined>();
  const { user, updateUser, tokens } = useAppData();

  const stableCoins = tokens.filter((item) => item.is_stablecoin);
  const cryptos = tokens.filter((item) => !item.is_stablecoin);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = useCallback(async () => {
    // Ensure refresh only happens when triggered otherwise it refreshes the user balances on every render (not cool)
    if (!refreshing) {
      setRefreshing(true);
      try {
        await refreshUserBalances(user, updateUser);
      } finally {
        setRefreshing(false);
      }
    }
  }, [refreshing, refreshUserBalances]);

  return (
    <Frame>
      <HeaderBar title="Assets" />
      <ScrollView showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
        }
      >
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
      </ScrollView>
    </Frame>
  );
}
