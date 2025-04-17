import {
  OrderBookApi,
  SupportedChainId,
  OrderQuoteRequest,
  OrderQuoteSideKindSell,
} from '@cowprotocol/cow-sdk';
import { getCowAppdata } from './getCowAppdata';

const orderBookApi = new OrderBookApi({ chainId: SupportedChainId.BASE });

const { content, hash } = getCowAppdata();

export const getCowQuote = async (
  address: string,
  sellToken: string,
  buyToken: string,
  sellAmount: string
) => {
  const quoteRequest: OrderQuoteRequest = {
    sellToken,
    buyToken,
    from: address,
    receiver: address,
    sellAmountBeforeFee: sellAmount,
    kind: OrderQuoteSideKindSell.SELL,
    appData: content,
    appDataHash: hash,
  };
  const { quote } = await orderBookApi.getQuote(quoteRequest);
  return quote;
};
