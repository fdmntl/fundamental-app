import {
  OrderBookApi,
  SupportedChainId,
  OrderQuoteRequest,
  OrderQuoteSideKindSell,
  OrderSigningUtils,
  UnsignedOrder,
  SigningScheme,
  OrderParameters,
  SigningResult,
} from '@cowprotocol/cow-sdk';
import { OrderCreation } from '@cowprotocol/cow-sdk/dist/order-book/generated/models/OrderCreation';
import { Order, OrderBalance, OrderKind, domain, hashOrder } from '@cowprotocol/contracts';
import { PrivyEmbeddedWalletProvider } from '@privy-io/expo';

const orderBookApi = new OrderBookApi({ chainId: SupportedChainId.BASE });

export const submitCowOrder = async (
  quote: OrderParameters,
  sellAmount: string,
  signature: SigningResult
) => {
  try {
    const orderId = await orderBookApi.sendOrder({
      ...quote,
      ...signature,
      sellAmount: sellAmount,
      feeAmount: '0',
      signingScheme: signature.signingScheme as unknown as SigningScheme,
    });
  } catch (error) {
    console.error('Error submitting order:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
  }
};
