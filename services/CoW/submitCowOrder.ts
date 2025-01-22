import {
  OrderBookApi,
  SupportedChainId,
  OrderQuoteRequest,
  OrderQuoteSideKindSell,
  OrderSigningUtils,
  UnsignedOrder,
  SigningScheme,
  OrderParameters,
} from '@cowprotocol/cow-sdk';
import { OrderCreation } from '@cowprotocol/cow-sdk/dist/order-book/generated/models/OrderCreation';
import { Order, OrderBalance, OrderKind, domain, hashOrder } from '@cowprotocol/contracts';
import { PrivyEmbeddedWalletProvider } from '@privy-io/expo';

const orderBookApi = new OrderBookApi({ chainId: SupportedChainId.BASE });

export const submitCowOrder = async (quote: OrderParameters, signature: string) => {
  console.log('Submitting order:', quote);
  signature = '0x123';
  try {
    const body: OrderCreation = {
      sellToken: quote.sellToken,
      buyToken: quote.buyToken,
      sellAmount: quote.sellAmount,
      buyAmount: quote.buyAmount,
      validTo: quote.validTo,
      feeAmount: quote.feeAmount,
      kind: quote.kind,
      partiallyFillable: quote.partiallyFillable,
      appData: quote.appData,
      signingScheme: SigningScheme.ETHSIGN,
      signature,
    };
    console.log('Order body:', body);
    const orderId = await orderBookApi.sendOrder(body);
    console.log('Order ID:', orderId);
    return orderId;
  } catch (error) {
    console.error('Error submitting order:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    // console.error('Stack trace:', error?.stack);
    return error;
  }
};
