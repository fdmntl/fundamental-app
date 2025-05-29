import { Feather } from '@expo/vector-icons';
import { View, Image, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';

import { FText } from '../Text/FText';

import { TradeOrder } from '~/components/Wrappers/AppData'; // Assuming AppData provides TradeOrder
import { Token } from '~/types/supabaseTypes';
import { tokenIcons } from '~/utils/helpers/mappings/tokenIcons';
import { digitsToAmount } from '~/utils/helpers/tokens/digitsToAmount';
import { printToken } from '~/utils/helpers/tokens/printToken';

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

export interface TradeOrderItemProps {
  order: TradeOrder;
}

export const TradeOrderItem: React.FC<TradeOrderItemProps> = ({ order }) => {
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
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
      pulseAnimationValue.setValue(1);
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
      <View>{displayStatusIcon()}</View>
    </Animated.View>
  );
};
