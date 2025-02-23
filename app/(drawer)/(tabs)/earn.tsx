import { Feather } from '@expo/vector-icons';
import { View } from 'react-native';
import React from 'react';
import { useCallback } from 'react';
import { RefreshControl, ScrollView } from'react-native-gesture-handler';

import { HeaderBar } from '~/components/HeaderBar';
import TestModule from '~/components/TestModule';
import { FText } from '~/components/Text/FText';
import { Frame } from '~/components/Wrappers/Frame';
import { useAppData } from '~/components/Wrappers/AppData';
import { refreshUserBalances } from '~/services/refreshUserBalance';

export default function Earn() {
    const { user, updateUser } = useAppData();
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
      <HeaderBar title="Earn" />
      <ScrollView showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
              }
            >
        <View className="mx-auto items-center">
          <TestModule />
        </View>
      </ScrollView>
    </Frame>
  );
}
