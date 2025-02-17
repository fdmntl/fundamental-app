import { OrderBookApi, SupportedChainId, UID } from '@cowprotocol/cow-sdk';

const orderBookApi = new OrderBookApi({ chainId: SupportedChainId.BASE });

export const getCowOrderStatus = async (orderUid: string) => {
  try {
    console.log('Getting order status for:', orderUid);
    const order = await orderBookApi.getOrder(orderUid);
    const trades = await orderBookApi.getTrades({ orderUid });
    console.log('Order:', order);
    console.log('Trades:', trades);
    return { order, trades };
  } catch (error) {
    console.error('Error getting order status:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return null;
  }
};
