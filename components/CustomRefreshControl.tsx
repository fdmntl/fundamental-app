import React, { useCallback, useState } from 'react';
import { ScrollView, RefreshControl, ViewStyle } from 'react-native';

import { useTheme } from './Wrappers/ThemeWrapper';

interface CustomRefreshControlProps {
  children: React.ReactNode;
  scrollEnabled?: boolean;
  contentContainerStyle?: ViewStyle;
  onRefresh: () => Promise<void>;
}

export const CustomRefreshControl = ({
  children,
  scrollEnabled = true,
  contentContainerStyle,
  onRefresh,
}: CustomRefreshControlProps) => {
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useTheme();
  const tintColor = theme === 'dark' ? 'white' : 'black';

  const onRefreshHandler = useCallback(async () => {
    if (!refreshing) {
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
  }, [refreshing, onRefresh]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      scrollEnabled={scrollEnabled}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefreshHandler}
          tintColor={tintColor}
        />
      }
      contentContainerStyle={contentContainerStyle}>
      {children}
    </ScrollView>
  );
};
