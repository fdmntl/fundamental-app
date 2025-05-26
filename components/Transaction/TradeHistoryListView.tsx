import { View } from 'react-native';

import { FText } from '../Text/FText';

import { TradeOrder } from '~/components/Wrappers/AppData';
import { Token } from '~/types/supabaseTypes';
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
      return isoDateString.replace('T', ' ').substring(0, 19);
    } catch (e) {
      console.error('Error formatting date:', e);
      return isoDateString; // Return original if formatting fails
    }
  };

  return (
    <View>
      <View className="flex flex-row justify-between border-b border-gray-300 p-2">
        <FText className="w-1/4 text-base font-semibold">Status</FText>
        <FText className="w-1/4 text-right text-base font-semibold">Sell</FText>
        <FText className="w-1/4 text-right text-base font-semibold">Buy</FText>
        <FText className="w-1/4 text-right text-base font-semibold">Time</FText>
      </View>
      {isLoading ? (
        <FText className="py-4 text-center text-lg">Loading trade history...</FText>
      ) : tradeOrders && tradeOrders.length > 0 ? (
        tradeOrders.map((order, index) => {
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
              key={index}
              className="flex min-h-[50px] flex-row items-center justify-between border-b border-gray-200 p-2">
              <FText className="w-1/4 text-xs">{order.status}</FText>
              <View className="flex w-1/4 flex-col items-end">
                <FText className="text-xs">{sellAmountFormatted}</FText>
                <FText className="text-xs text-gray-500">{sellTokenDisplay.symbol}</FText>
              </View>
              <View className="flex w-1/4 flex-col items-end">
                <FText className="text-xs">{buyAmountFormatted}</FText>
                <FText className="text-xs text-gray-500">{buyTokenDisplay.symbol}</FText>
              </View>
              <FText className="w-1/4 text-right text-xs">{formatDate(order.date)}</FText>
            </View>
          );
        })
      ) : (
        <FText className="py-4 text-center text-lg">No trade history available</FText>
      )}
    </View>
  );
};
