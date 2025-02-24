import {
  OrderParameters,
  OrderSigningUtils,
  SupportedChainId,
  UnsignedOrder,
} from '@cowprotocol/cow-sdk';
import { PrivyEmbeddedWalletProvider } from '@privy-io/expo';

import { getEthersSigner } from '~/services/Ethers/getEthersSigner';

export const signCowQuote = async (
  quote: OrderParameters,
  sellAmount: string,
  receiver: string,
  provider: PrivyEmbeddedWalletProvider
) => {
  const signer = getEthersSigner(provider);
  const feeAmount = '0';
  const order: UnsignedOrder = {
    ...quote,
    sellAmount,
    feeAmount,
    receiver,
  };
  const signature = await OrderSigningUtils.signOrder(order, SupportedChainId.BASE, signer);
  return signature;
};
