import { OrderParameters } from '@cowprotocol/cow-sdk';

import { Order, OrderBalance, OrderKind, domain, hashOrder } from '@cowprotocol/contracts';

import { signMessage } from '../viemService';

import { PrivyEmbeddedWalletProvider } from '@privy-io/expo';

export const signCowQuote = async (
  quote: OrderParameters,
  sellAmount: string,
  receiver: string,
  provider: PrivyEmbeddedWalletProvider
) => {
  const order: Order = quote as Order;
  const digest = hashOrder(domain(1, '0x9008D19f58AAbD9eD0D60971565AA8510560ab41'), order);
  const signature = await signMessage(provider, digest);
  console.log('Signature:', signature);
  return signature;
};
