import { useEffect, useRef } from 'react';
import Toast from 'react-native-toast-message';

import { useAppData } from '~/components/Wrappers/AppData';
import { getCowOrderStatus } from '~/services/CoW/getCowOrderStatus';
import { digitsToAmount } from '~/utils/helpers/tokens/digitsToAmount';

interface OrderStatusPollingProps {
  orderUid: string;
}

export const OrderStatusPolling = ({ orderUid }: OrderStatusPollingProps) => {
  const isPolling = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { getToken } = useAppData();

  const scheduleNextPoll = () => {
    if (isPolling.current) {
      timeoutRef.current = setTimeout(pollOrderStatus, 2000);
    }
  };

  const pollOrderStatus = async () => {
    try {
      const response = await getCowOrderStatus(orderUid);
      if (!response) {
        console.log('Order status is null');
        return scheduleNextPoll();
      }

      const { order } = response;
      console.log('order: ', order);

      // If expired, stop polling
      if (order.status === 'expired') {
        console.log('Order expired, stopping polling.');
        return;
      }

      // If not fulfilled, schedule next poll (fail-safe)
      if (order.status !== 'fulfilled') {
        return scheduleNextPoll();
      }

      // If fulfilled, show toast
      const token = getToken(order.sellToken);
      const amount = Number(order.buyAmount);
      const price = amount && token && digitsToAmount(amount, token);

      Toast.show({
        type: 'fundamental',
        text1: 'Order Fulfilled!',
        text2: token && price ? `You bought ${price} ${token.symbol}` : undefined,
      });
    } catch (error) {
      console.log('Error polling order status:', error);
    }
    scheduleNextPoll();
  };

  useEffect(() => {
    pollOrderStatus();

    return () => {
      isPolling.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [orderUid]);

  return null;
};
