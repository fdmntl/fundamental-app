import React from 'react';
import { View } from 'react-native';

import { FText } from '~/components/Text/FText';
import { TradeOrderItem } from '~/components/Transaction/TradeOrderItem';
import { TradeOrderItemSkeleton } from '~/components/Transaction/TradeOrderItemSkeleton';
import { TradeOrder } from '~/components/Wrappers/AppData';

interface PendingTradesSectionProps {
  tradeOrders: TradeOrder[];
  isLoading: boolean;
}

export const PendingTradesSection: React.FC<PendingTradesSectionProps> = ({
  tradeOrders,
  isLoading,
}) => {
  const pendingOrders = tradeOrders.filter((order) => order.status.toLowerCase() === 'open');

  if (!isLoading && pendingOrders.length === 0) {
    return null; // Don't render anything if not loading and no pending orders
  }

  return (
    <View className="mt-4">
      <FText className="px-4 pb-2 text-lg" bold>
        Pending Trades
      </FText>
      {isLoading ? (
        <View>{tradeOrders.length > 1 && <TradeOrderItemSkeleton />}</View>
      ) : (
        pendingOrders.map((order, index) => (
          <TradeOrderItem key={`pending-trade-${order.date}-${index}`} order={order} />
        ))
      )}
    </View>
  );
};
