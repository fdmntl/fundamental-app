import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';

export const copyToClipboard = async (text?: string) => {
  if (!text) return;
  await Clipboard.setStringAsync(text);
  Toast.show({
    type: 'success',
    text1: 'Copied to clipboard',
    text2: text,
    visibilityTime: 3000,
    autoHide: true,
  });
  // TODO: use Toast here
  console.log('Copied to clipboard:', text);
};
