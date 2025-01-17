import {
  OrderBookApi,
  SupportedChainId,
  OrderQuoteRequest,
  OrderQuoteSideKindSell,
} from '@cowprotocol/cow-sdk';

const orderBookApi2 = new OrderBookApi({ chainId: SupportedChainId.BASE });

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
  };
  const { quote } = await orderBookApi2.getQuote(quoteRequest);
  console.log(quote);
  return quote;
};
