import { BaseToast, ErrorToast, SuccessToast } from 'react-native-toast-message';

export const toastConfig = {
  fundamental: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#8720FE',
        backgroundColor: '#F3F3F8',
        borderRadius: 15,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 17,
        fontWeight: '600',
      }}
      text2Style={{
        fontSize: 15,
        color: '#888888',
      }}
    />
  ),
  success: (props: any) => (
    <SuccessToast
      {...props}
      style={{ borderRadius: 15, backgroundColor: '#F3F3F8', borderLeftColor: '#66BB6A' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 17, fontWeight: '600' }}
      text2Style={{ fontSize: 15, color: '#888888' }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderRadius: 15, backgroundColor: '#F3F3F8', borderLeftColor: '#F05E5C' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 17, fontWeight: '600' }}
      text2Style={{ fontSize: 15, color: '#888888' }}
    />
  ),
  info: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderRadius: 15, backgroundColor: '#F3F3F8', borderLeftColor: '#42A5F5' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 17, fontWeight: '600' }}
      text2Style={{ fontSize: 15, color: '#888888' }}
    />
  ),
};
