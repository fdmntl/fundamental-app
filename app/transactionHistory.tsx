import { DetailsHeader } from '~/components/Assets/DetailsHeader';
import { BalanceRefreshControl } from '~/components/BalanceRefreshControl';
import { TradeHistoryListView } from '~/components/Transaction/TradeHistoryListView';
import { useAppData } from '~/components/Wrappers/AppData';
import { Frame } from '~/components/Wrappers/Frame';

export default function TransactionHistory() {
  const { fetchTradeHistory, tradeHistory, isTradeHistoryLoading } = useAppData();

  return (
    <Frame>
      <DetailsHeader title="Transaction History" />
      <BalanceRefreshControl onRefresh={fetchTradeHistory}>
        <TradeHistoryListView tradeOrders={tradeHistory} isLoading={isTradeHistoryLoading} />
      </BalanceRefreshControl>
    </Frame>
  );
}
