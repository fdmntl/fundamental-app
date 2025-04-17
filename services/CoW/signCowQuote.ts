import {
  OrderParameters,
  OrderSigningUtils,
  SupportedChainId,
  UnsignedOrder,
} from '@cowprotocol/cow-sdk';
import { PrivyEmbeddedWalletProvider } from '@privy-io/expo';

import { getCowAppdata } from './getCowAppdata';
import { getEthersSigner } from '~/services/Ethers/getEthersSigner';

const { hash } = getCowAppdata();

export const signCowQuote = async (
  quote: OrderParameters,
  sellAmount: string,
  receiver: string,
  provider: PrivyEmbeddedWalletProvider
) => {
  const signer = getEthersSigner(provider);
  const order: UnsignedOrder = {
    ...quote,
    sellAmount: sellAmount,
    buyAmount: quote.buyAmount,
    feeAmount: '0',
    receiver,
    appData: hash,
  };
  console.log('SELL ORDER:', order);
  const signature = await OrderSigningUtils.signOrder(order, SupportedChainId.BASE, signer);
  return signature;
};
