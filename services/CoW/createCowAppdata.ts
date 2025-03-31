import { MetadataApi, latest } from '@cowprotocol/app-data';

export const createCowAppdata = async () => {
  const metadataApi = new MetadataApi();
  const appCode = 'Fundamental';
  const environment = 'prod';
  const referrer = { address: '0x4dcba6746997427dac9341c2a007f10d673ad878' };
  const quoteAppDoc: latest.Quote = { slippageBips: 50 };
  const orderClass: latest.OrderClass = { orderClass: 'market' };
  const appDataDoc = await metadataApi.generateAppDataDoc({
    appCode,
    environment,
    metadata: {
      referrer,
      quote: quoteAppDoc,
      orderClass,
    },
  });

  const { appDataHex, appDataContent } = await metadataApi.appDataToCid(appDataDoc);

  return appDataDoc;
};
