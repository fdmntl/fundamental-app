import { OrderBookApi, SupportedChainId } from '@cowprotocol/cow-sdk';

const orderBookApi = new OrderBookApi({ chainId: SupportedChainId.BASE });

export const getCowOrderBook = async (address: string) => {
  try {
    const fetchedOrders = await orderBookApi.getOrders({ owner: address });
    return fetchedOrders;
  } catch (err: any) {
    console.error('Erreur lors de la récupération des ordres:', err);
    return null;
  }
};
