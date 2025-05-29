import { Feather } from '@expo/vector-icons';
import { View, Image, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';

import { FText } from '../Text/FText';
import { TradeOrderItemSkeleton } from './TradeOrderItemSkeleton';

import { TradeOrder } from '~/components/Wrappers/AppData';
import { Token } from '~/types/supabaseTypes';
import { tokenIcons } from '~/utils/helpers/mappings/tokenIcons';
import { digitsToAmount } from '~/utils/helpers/tokens/digitsToAmount';
import { printToken } from '~/utils/helpers/tokens/printToken';

interface TradeHistoryListViewProps {
  tradeOrders: TradeOrder[];
  isLoading: boolean;
}

// Define a default token structure for unknown tokens
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

// Helper function to get a displayable token, ensuring 'digits' is present
const getDisplayToken = (
  tokenInput: Token | { name: string; symbol: string; address: string }
): Token => {
  if ('digits' in tokenInput && typeof tokenInput.digits === 'number') {
    return tokenInput as Token;
  }
  return UNKNOWN_TOKEN_FALLBACK(tokenInput.address);
};

interface TradeOrderItemProps {
  order: TradeOrder;
}

const TradeOrderItem: React.FC<TradeOrderItemProps> = ({ order }) => {
  const pulseAnimationValue = useRef(new Animated.Value(1)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

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

  useEffect(() => {
    if (order.status.toLowerCase() === 'open') {
      pulseAnimationValue.setValue(1);
      animationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimationValue, {
            toValue: 0.4,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimationValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      animationRef.current.start();
    } else {
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
      pulseAnimationValue.setValue(1);
    }

    return () => {
      // Cleanup: stop animation when component unmounts or order.status changes
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
      pulseAnimationValue.setValue(1); // Ensure opacity is reset on unmount
    };
  }, [order.status, pulseAnimationValue]);

  const animatedStyle =
    order.status.toLowerCase() === 'open' ? { opacity: pulseAnimationValue } : {};

  const displayStatusIcon = () => {
    switch (order.status.toLowerCase()) {
      case 'open':
        return <Feather name="clock" size={24} className="text-warning" />;
      case 'fulfilled':
        return <Feather name="check-circle" size={24} className="text-success" />;
      default:
        return <Feather name="x-circle" size={24} className="text-error" />;
    }
  };

  return (
    <Animated.View
      style={animatedStyle}
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
        <FText
          bold
          className={`${order.status.toLowerCase() === 'fulfilled' ? 'text-success' : ''}`}>
          {`${buyAmountNum > 0 ? '+' : ''}${buyAmountFormatted} ${buyTokenDisplay.symbol}`}
        </FText>
        <FText className="!text-neutral">
          {`${sellAmountNum > 0 ? '-' : ''}${sellAmountFormatted} ${sellTokenDisplay.symbol}`}
        </FText>
      </View>
      {/* Status */}
      <View>{displayStatusIcon()}</View>
    </Animated.View>
  );
};

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
  const otherOrders = tradeOrders.filter((order) => order.status.toLowerCase() !== 'open');

  // Group non-pending orders by their formatted date
  const groupedOtherOrdersByDate: Record<string, TradeOrder[]> = otherOrders.reduce(
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
  const hasOtherGroupedOrders = Object.keys(groupedOtherOrdersByDate).length > 0;

  return (
    <View>
      {isLoading ? (
        <View>
          <TradeOrderItemSkeleton />
        </View>
      ) : hasPendingOrders || hasOtherGroupedOrders ? (
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

          {/* Completed/Failed Orders Section */}
          {hasOtherGroupedOrders &&
            Object.entries(groupedOtherOrdersByDate).map(([date, ordersInGroup]) => (
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
