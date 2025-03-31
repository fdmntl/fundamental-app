import {
  OrderBookApi,
  SupportedChainId,
  OrderQuoteRequest,
  OrderQuoteSideKindSell,
} from '@cowprotocol/cow-sdk';

const orderBookApi = new OrderBookApi({ chainId: SupportedChainId.BASE });

const appDataContent: string =
  '{"appCode":"Fundamental","environment":"production","metadata":{"hooks":{"version":"0.1.0"},"quote":{"slippageBips":100,"smartSlippage":false}},"version":"1.3.0"}';
const appDataHash: string = '0x6562949e4016f912411cc2b2439b95721938a99acfbe2433c4252d2109df533a';

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
    appData: appDataContent,
    appDataHash,
  };
  const { quote } = await orderBookApi.getQuote(quoteRequest);
  return quote;
};
