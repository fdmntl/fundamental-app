import {
  OrderParameters,
  OrderSigningUtils,
  SupportedChainId,
  UnsignedOrder,
} from '@cowprotocol/cow-sdk';
import { PrivyEmbeddedWalletProvider } from '@privy-io/expo';

import { getEthersSigner } from '~/services/Ethers/getEthersSigner';

const appDataContent: string =
  '{"appCode":"Fundamental","environment":"production","metadata":{"hooks":{"version":"0.1.0"},"quote":{"slippageBips":100,"smartSlippage":false}},"version":"1.3.0"}';
const appDataHash: string = '0x6562949e4016f912411cc2b2439b95721938a99acfbe2433c4252d2109df533a';

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
    appData: appDataHash,
  };
  console.log('SELL ORDER:', order);
  const signature = await OrderSigningUtils.signOrder(order, SupportedChainId.BASE, signer);
  return signature;
};
