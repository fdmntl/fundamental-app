import * as WebBrowser from 'expo-web-browser';

const PROJECT_ID = 'f4646df4-4abb-447c-96e6-fb39182b02a4';

function buildOnrampUrl(
  address: string,
  { assets = ['USDC', 'ETH'], chain = 'base', presetFiatAmount = 20, fiatCurrency = 'EUR' } = {}
) {
  const base = 'https://pay.coinbase.com/buy';
  const params = new URLSearchParams({
    appId: PROJECT_ID,
    addresses: JSON.stringify({ [address]: [chain] }),
    assets: JSON.stringify(assets),
    presetFiatAmount: presetFiatAmount.toString(),
    fiatCurrency,
  });
  return `${base}?${params.toString()}`;
}

export async function coinbaseOnramp(addr: string) {
  const url = buildOnrampUrl(addr);
  await WebBrowser.openBrowserAsync(url);
}
