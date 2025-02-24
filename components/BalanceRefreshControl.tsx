import React, { useCallback, useState } from 'react';
import { ScrollView, RefreshControl } from 'react-native';

import { refreshUserBalances } from '~/services/refreshUserBalance';
import { useAppData } from './Wrappers/AppData';
import { useTheme } from './Wrappers/ThemeWrapper';

interface BalanceRefreshControlProps {
  children: React.ReactNode;
}

export const BalanceRefreshControl = ({ children }: BalanceRefreshControlProps) => {
  const [refreshing, setRefreshing] = useState(false);
  const { user, updateUser } = useAppData();
  const { theme } = useTheme();
  const tintColor = theme === 'dark' ? 'white' : 'black';

  const onRefresh = useCallback(async () => {
    if (!refreshing) {
      setRefreshing(true);
      try {
        if (!user) {
          console.warn('User is undefined, skipping refresh.');
          return;
        }
        await refreshUserBalances(user, updateUser);
      } finally {
        setRefreshing(false);
      }
    }
  }, [refreshing, user, updateUser]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={tintColor} />
      }>
      {children}
    </ScrollView>
  );
};
