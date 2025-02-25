import { OrderBookApi, SupportedChainId, UID } from '@cowprotocol/cow-sdk';

const orderBookApi = new OrderBookApi({ chainId: SupportedChainId.BASE });

export const getCowOrderStatus = async (orderUid: string) => {
  try {
    console.log('Getting order status for:', orderUid);
    // order conains the order details, trades contains the trades that have been executed as part of that order
    // the information you want is likely in order.
    const order = await orderBookApi.getOrder(orderUid);
    const trades = await orderBookApi.getTrades({ orderUid });
    return { order, trades };
  } catch (error) {
    console.error('Error getting order status:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return null;
  }
};
