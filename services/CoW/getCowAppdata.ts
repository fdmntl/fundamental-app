import { MetadataApi, latest } from '@cowprotocol/app-data';

export const getCowAppdata = (): {
  content: string;
  hash: string;
} => {
  const content: string =
    '{"appCode":"Fundamental","environment":"production","metadata":{"hooks":{"version":"0.1.0"},"quote":{"slippageBips":100,"smartSlippage":false}},"version":"1.3.0"}';
  const hash: string = '0x6562949e4016f912411cc2b2439b95721938a99acfbe2433c4252d2109df533a';
  return { content, hash };
};
