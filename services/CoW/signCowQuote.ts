import { OrderParameters } from '@cowprotocol/cow-sdk';

import { OrderSigningUtils, SupportedChainId, UnsignedOrder } from '@cowprotocol/cow-sdk';

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
    receiver: receiver,
  };
  const signature = await OrderSigningUtils.signOrder(order, SupportedChainId.BASE, signer);
  return signature;
  // const order: Order = quote as Order;
  // const digest = hashOrder(domain(1, '0x9008D19f58AAbD9eD0D60971565AA8510560ab41'), order);
  // const signature = await signMessage(provider, digest);
  // console.log('Signature:', signature);
  // return signature;
};
