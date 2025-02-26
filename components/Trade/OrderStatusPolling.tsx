import { useEffect, useRef } from 'react';

import { getCowOrderStatus } from '~/services/CoW/getCowOrderStatus';

interface OrderStatusPollingProps {
  orderUid: string;
}

export const OrderStatusPolling = ({ orderUid }: OrderStatusPollingProps) => {
  const isPolling = useRef(true);

  useEffect(() => {
    const pollOrderStatus = async () => {
      try {
        const response = await getCowOrderStatus(orderUid);
        if (response) {
          const { order } = response;
          console.log('order: ', order);
          // TODO: handle order status, if fulfilled, use toast, else poll again
        } else {
          console.log('Order status is null');
        }
      } catch (error) {
        console.error('Error polling order status:', error);
      }

      if (isPolling.current) {
        // Poll every 2 seconds
        setTimeout(pollOrderStatus, 2000);
      }
    };

    pollOrderStatus();

    return () => {
      isPolling.current = false;
    };
  }, [orderUid]);

  return null;
};
