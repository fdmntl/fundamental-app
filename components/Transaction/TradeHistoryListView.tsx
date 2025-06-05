import { View } from 'react-native';

import { FText } from '../Text/FText';
import { TradeOrderItemSkeleton } from './TradeOrderItemSkeleton';
import { TradeOrderItem } from './TradeOrderItem';

import { TradeOrder } from '~/components/Wrappers/AppData';

interface TradeHistoryListViewProps {
  tradeOrders: TradeOrder[];
  isLoading: boolean;
}

export const TradeHistoryListView = ({ tradeOrders, isLoading }: TradeHistoryListViewProps) => {
  const formatDate = (isoDateString: string): string => {
    if (!isoDateString) return 'N/A';
    try {
      const date = new Date(isoDateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return isoDateString;
    }
  };

  const pendingOrders = tradeOrders.filter((order) => order.status.toLowerCase() === 'open');
  const fulfilledOrders = tradeOrders.filter((order) => order.status.toLowerCase() === 'fulfilled');

  // Group non-pending orders by their formatted date
  const groupedFulfilledOrdersByDate: Record<string, TradeOrder[]> = fulfilledOrders.reduce(
    (groups, order) => {
      const dateKey = formatDate(order.date);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(order);
      return groups;
    },
    {} as Record<string, TradeOrder[]>
  );

  const hasPendingOrders = pendingOrders.length > 0;
  const hasFulfilledGroupedOrders = Object.keys(groupedFulfilledOrdersByDate).length > 0;

  return (
    <View>
      {isLoading ? (
        <View>
          <TradeOrderItemSkeleton />
        </View>
      ) : hasPendingOrders || hasFulfilledGroupedOrders ? (
        <>
          {/* Pending Orders Section */}
          {hasPendingOrders && (
            <View className="mb-4">
              <FText className="px-4 py-2 text-lg" bold>
                Pending Transactions
              </FText>
              {pendingOrders.map((order, index) => (
                <TradeOrderItem key={`pending-${order.date}-${index}`} order={order} />
              ))}
            </View>
          )}

          {/* Fulfilled Orders Section */}
          {hasFulfilledGroupedOrders &&
            Object.entries(groupedFulfilledOrdersByDate).map(([date, ordersInGroup]) => (
              <View key={date}>
                <FText className="px-4 py-2" bold>
                  {date}
                </FText>
                {ordersInGroup.map((order, index) => (
                  <TradeOrderItem key={`${date}-${order.date}-${index}`} order={order} />
                ))}
              </View>
            ))}
        </>
      ) : (
        <FText className="py-4 text-center text-lg">No trade history available</FText>
      )}
    </View>
  );
};
