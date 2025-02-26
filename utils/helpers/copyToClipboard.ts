import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';

export const copyToClipboard = async (text?: string) => {
  if (!text) return;
  await Clipboard.setStringAsync(text);
  Toast.show({
    type: 'fundamental',
    text1: 'Copied to clipboard',
    text2: text,
    visibilityTime: 2000,
    autoHide: true,
  });
  console.log('Copied to clipboard:', text);
};
