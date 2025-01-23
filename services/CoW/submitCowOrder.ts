import {
  OrderBookApi,
  SupportedChainId,
  SigningScheme,
  OrderParameters,
  SigningResult,
} from '@cowprotocol/cow-sdk';

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
    return orderId;
  } catch (error) {
    console.error('Error submitting order:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
  }
};
