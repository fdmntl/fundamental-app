import * as Clipboard from 'expo-clipboard';

export const copyToClipboard = async (text?: string) => {
  if (!text) return;
  await Clipboard.setStringAsync(text);
  // TODO: use Toast here
  console.log('Copied to clipboard:', text);
};
