import { View, TouchableOpacity } from 'react-native';

import { useAppData } from '~/components/Wrappers/AppData';
import { TradeHistoryListView } from './TradeHistoryListView';
import { FText } from '../Text/FText';

export const TransactionBookDisplay = () => {
  const { tradeHistory, isTradeHistoryLoading, fetchTradeHistory } = useAppData();

  return (
    <View className="flex-1 p-4">
      <View className="mb-4 flex-row items-center justify-between">
        <FText className="text-xl font-bold">Trade History</FText>
        <TouchableOpacity
          onPress={fetchTradeHistory}
          disabled={isTradeHistoryLoading}
          className="rounded-md bg-blue-500 px-4 py-2">
          <FText className="font-semibold text-white">
            {isTradeHistoryLoading ? 'Refreshing...' : 'Refresh'}
          </FText>
        </TouchableOpacity>
      </View>
      <TradeHistoryListView tradeOrders={tradeHistory} isLoading={isTradeHistoryLoading} />
    </View>
  );
};
