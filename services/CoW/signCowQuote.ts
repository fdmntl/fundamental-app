import {
  OrderBookApi,
  OrderParameters,
  OrderQuoteRequest,
  OrderQuoteSideKindSell,
  OrderSigningUtils,
  SigningResult,
  SupportedChainId,
  UnsignedOrder,
} from '@cowprotocol/cow-sdk';

import { ethers } from 'ethers';

export const signCowQuote = async (
  quote: OrderParameters,
  sellAmount: string,
  receiver: string,
  signer: ethers.providers.JsonRpcSigner
) => {
  const unsignedOrder: UnsignedOrder = {
    ...quote,
    sellAmount,
    receiver,
  };

  const signedOrder = OrderSigningUtils.signOrder(unsignedOrder, SupportedChainId.BASE, signer);
  return signedOrder;
};
