import * as WebBrowser from 'expo-web-browser';

function buildOnrampUrl(
  address: string,
  { assets = ['USDC', 'ETH'], chain = 'base', presetFiatAmount = 20, fiatCurrency = 'EUR' } = {}
) {
  const base = 'https://zkp2p.xyz/swap';
  const referrer = 'Fundamental';

  return `${base}?refferer=${referrer}&recipientAddress=${address}`;
}

export async function zkp2pOnrampOnramp(addr: string) {
  const url = buildOnrampUrl(addr);
  await WebBrowser.openBrowserAsync(url);
}
