import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { getCowOrderStatus } from '~/services/CoW/getCowOrderStatus';
import { Token } from '~/types/supabaseTypes';
import { digitsToAmount } from '~/utils/helpers/tokens/digitsToAmount';

interface PolledOrderInfo {
  uid?: string;
  status: string;
}

interface OrderStatusPollerProps {
  tradeHistory: PolledOrderInfo[];
  fetchTradeHistory: () => void;
  getToken: (address: string) => Token | undefined;
}

export const OrderStatusPoller: React.FC<OrderStatusPollerProps> = ({
  tradeHistory,
  fetchTradeHistory,
  getToken,
}) => {
  const [internalPollingIntervalId, setInternalPollingIntervalId] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    const openOrders = tradeHistory.filter(
      (order) => order.status && order.status.toLowerCase() === 'open'
    );

    if (openOrders.length > 0) {
      if (internalPollingIntervalId) {
        clearInterval(internalPollingIntervalId);
      }

      const newIntervalId = setInterval(async () => {
        let refreshNeeded = false;
        for (const order of openOrders) {
          if (!order.uid) {
            console.warn('Order UID is missing, cannot check status:', order);
            continue;
          }
          try {
            const statusResult = await getCowOrderStatus(order.uid);
            if (
              statusResult &&
              statusResult.order &&
              statusResult.order.status.toLowerCase() !== 'open'
            ) {
              const orderStatus = statusResult.order.status.toLowerCase();
              console.log(
                `Order ${order.uid} status changed to ${statusResult.order.status}. Refreshing history.`
              );
              refreshNeeded = true;

              if (orderStatus === 'fulfilled') {
                const boughtTokenInfo = getToken(statusResult.order.buyToken);
                if (boughtTokenInfo && statusResult.order.executedBuyAmount) {
                  const displayAmount = digitsToAmount(
                    Number(statusResult.order.executedBuyAmount),
                    boughtTokenInfo
                  );
                  const amountStr = displayAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,
                  });
                  Toast.show({
                    type: 'success',
                    text1: 'Trade Completed!',
                    text2: `+${amountStr} ${boughtTokenInfo.symbol}`,
                  });
                }
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Trade timed out!',
                });
              }
              break;
            }
          } catch (error) {
            console.log(`Error fetching status for order ${order.uid}:`, error);
          }
        }

        if (refreshNeeded) {
          fetchTradeHistory();
        }
      }, 10000); // Poll every 10 seconds

      setInternalPollingIntervalId(newIntervalId);
    } else {
      if (internalPollingIntervalId) {
        clearInterval(internalPollingIntervalId);
        setInternalPollingIntervalId(null);
      }
    }

    return () => {
      if (internalPollingIntervalId) {
        clearInterval(internalPollingIntervalId);
      }
    };
  }, [tradeHistory, fetchTradeHistory, getToken]);

  return null;
};
