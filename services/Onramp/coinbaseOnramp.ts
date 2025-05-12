import * as WebBrowser from 'expo-web-browser';
import { getOnrampBuyUrl } from '@coinbase/onchainkit/fund';

const projectId = 'f4646df4-4abb-447c-96e6-fb39182b02a4';
export async function coinbaseOnramp(addr: string) {
  const url = getOnrampBuyUrl({
    projectId,
    addresses: { [addr]: ['base'] },
    assets: ['USDC'],
    presetFiatAmount: 20,
    fiatCurrency: 'EUR',
  });
  await WebBrowser.openBrowserAsync(url);
}
