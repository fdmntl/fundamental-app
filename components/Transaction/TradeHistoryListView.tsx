import { Feather } from '@expo/vector-icons';
import { View, Image } from 'react-native';

import { FText } from '../Text/FText';

import { TradeOrder } from '~/components/Wrappers/AppData';
import { Token } from '~/types/supabaseTypes';
import { tokenIcons } from '~/utils/helpers/mappings/tokenIcons';
import { digitsToAmount } from '~/utils/helpers/tokens/digitsToAmount';
import { printToken } from '~/utils/helpers/tokens/printToken';

interface TradeHistoryListViewProps {
  tradeOrders: TradeOrder[];
  isLoading: boolean;
}

// Define a default token structure for unknown tokens, using 'digits'
const UNKNOWN_TOKEN_FALLBACK = (address: string): Token => ({
  address,
  name: 'Unknown Token',
  symbol: '???',
  digits: 18,
  description: 'Unknown token',
  is_stablecoin: false,
  daily_values: [],
  weekly_values: [],
  monthly_values: [],
  yearly_values: [],
  last_value: 0,
});

const displayStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return <Feather name="clock" size={24} className="text-warning" />;
    case 'fulfilled':
      return <Feather name="check-circle" size={24} className="text-success" />;
    default:
      return <Feather name="x-circle" size={24} className="text-error" />;
  }
};

export const TradeHistoryListView = ({ tradeOrders, isLoading }: TradeHistoryListViewProps) => {
  const getDisplayToken = (
    tokenInput: Token | { name: string; symbol: string; address: string }
  ): Token => {
    if ('digits' in tokenInput && typeof tokenInput.digits === 'number') {
      return tokenInput as Token;
    }
    return UNKNOWN_TOKEN_FALLBACK(tokenInput.address);
  };

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

  // const formatTime = (isoDateString: string): string => {
  //   if (!isoDateString) return 'N/A';
  //   return isoDateString.substring(11, 16);
  // };

  // Group orders by their formatted date
  const groupedOrdersByDate: Record<string, TradeOrder[]> = tradeOrders.reduce(
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

  return (
    <View>
      {isLoading ? (
        <FText className="py-4 text-center text-lg">Loading trade history...</FText>
      ) : tradeOrders && tradeOrders.length > 0 ? (
        Object.entries(groupedOrdersByDate).map(([date, orders]) => (
          <View key={date}>
            {/* Date separator */}
            <FText className="px-4 py-2" bold>
              {date}
            </FText>
            {orders.map((order, index) => {
              const sellTokenDisplay = getDisplayToken(order.sellToken);
              const buyTokenDisplay = getDisplayToken(order.buyToken);
              const sellAmountNum = parseFloat(order.sellAmount);
              const buyAmountNum = parseFloat(order.buyAmount);
              const sellAmountFormatted = printToken(
                digitsToAmount(sellAmountNum, sellTokenDisplay),
                sellTokenDisplay
              );
              const buyAmountFormatted = printToken(
                digitsToAmount(buyAmountNum, buyTokenDisplay),
                buyTokenDisplay
              );
              return (
                <View
                  key={`${date}-${index}`}
                  className="mb-2 flex flex-row items-center justify-between rounded-xl bg-content p-4">
                  {/* Token icons */}
                  <View className="flex flex-row items-center">
                    <Image
                      source={tokenIcons[sellTokenDisplay.symbol]}
                      className="mb-3 h-10 w-10 rounded-full border border-gray-800"
                    />
                    <Image
                      source={tokenIcons[buyTokenDisplay.symbol]}
                      className="-ml-4 mt-3 h-10 w-10 rounded-full border border-gray-800"
                    />
                  </View>
                  {/* Amounts */}
                  <View className="flex flex-1 flex-col items-start px-4">
                    <FText bold>
                      {`${buyAmountNum > 0 ? '+' : ''}${buyAmountFormatted} ${buyTokenDisplay.symbol}`}
                    </FText>
                    <FText className="!text-neutral">
                      {`${sellAmountNum > 0 ? '-' : ''}${sellAmountFormatted} ${sellTokenDisplay.symbol}`}
                    </FText>
                  </View>
                  {/* Status */}
                  <View>{displayStatus(order.status)}</View>
                </View>
              );
            })}
          </View>
        ))
      ) : (
        <FText className="py-4 text-center text-lg">No trade history available</FText>
      )}
    </View>
  );
};
