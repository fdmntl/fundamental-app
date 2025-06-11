import {
  OrderBookApi,
  SupportedChainId,
  SigningScheme,
  OrderParameters,
  SigningResult,
} from '@cowprotocol/cow-sdk';

import { trackEvent } from '../PostHog/trackEvent';

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
      sellAmount,
      feeAmount: '0',
      signingScheme: signature.signingScheme as unknown as SigningScheme,
    });

    trackEvent('cow_order_submitted', {
      orderId,
      sellAmount,
      buyToken: quote.buyToken,
      sellToken: quote.sellToken,
      buyAmount: quote.buyAmount,
    });
    return orderId;
  } catch (error) {
    console.error('Error submitting order:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return null;
  }
};
