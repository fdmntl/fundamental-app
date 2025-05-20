import { useState, useEffect } from 'react';
import { View } from 'react-native';

import { getCowOrderBook } from '../../services/CoW/getCowOrderBook';
import { FText } from '../Text/FText';

import { fetchData } from '~/services/Supabase/fetchData';
import { User } from '~/types/supabaseTypes';
import { printableDigitsToAmount } from '~/utils/helpers/tokens/digitsToAmount';

interface TransactionBookDisplayProps {
  user: User;
}

export const TransactionBookDisplay = ({ user }: TransactionBookDisplayProps) => {
  const [Book, setBook] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      if (!user.wallet_address) return;

      try {
        const orderBook = await getCowOrderBook(user.wallet_address);
        if (!orderBook) {
          setBook(null);
          return;
        }
        // Keep only the status and id of the orders
        const filteredOrders = orderBook.map((order) => ({
          status: order.status,
          buyAmount: order.buyAmount,
          sellAmount: order.sellAmount,
          date: order.creationDate.slice(11, 19),
          buyTokenAddress: order.buyToken,
          sellTokenAddress: order.sellToken,
          buyToken: null,
          sellToken: null,
        }));
        const tokens = await fetchData();
        if (!tokens) {
          setBook(null);
          return;
        }
        // fill buyToken and sellToken with the token name
        const updatedOrders = filteredOrders.map((order) => {
          const buyToken = tokens.find(
            (token) => token.address.toLowerCase() === order.buyTokenAdress
          );
          const sellToken = tokens.find(
            (token) => token.address.toLowerCase() === order.sellTokenAdress
          );
          return {
            ...order,
            buyToken: buyToken ? buyToken : 'Unknown',
            sellToken: sellToken ? sellToken : 'Unknown',
          };
        });
        setBook(updatedOrders || 'No Book available');
      } catch (error) {
        console.error('Error fetching order Book:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [user.wallet_address]);

  return (
    <View>
      <View className="flex flex-row justify-between p-2">
        <FText className="text-lg">Status</FText>
        <FText className="text-lg">Sell Amount</FText>
        <FText className="text-lg">Buy Amount</FText>
        <FText className="text-lg">Date</FText>
      </View>
      {isLoading ? (
        <FText className="text-lg">Loading...</FText>
      ) : Book && Book.length > 0 ? (
        Book.map((order, index) => (
          // Display the order status, buy amount, sell amount, and date
          <View key={index} className="flex flex-row justify-between p-2">
            <FText className="text-lg">{order.status}</FText>
            <FText className="text-lg">
              {printableDigitsToAmount(order.sellAmount, order.sellToken)} {order.sellToken.symbol}
            </FText>
            <FText className="text-lg">
              {printableDigitsToAmount(order.buyAmount, order.buyToken)} {order.buyToken.symbol}
            </FText>
            <FText className="text-lg">{order.date}</FText>
          </View>
        ))
      ) : (
        <FText className="text-lg">No Book available</FText>
      )}
    </View>
  );
};
