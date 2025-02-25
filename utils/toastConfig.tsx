import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

// TODO: change file location & get rid of 'any' + handle themes + create custom types
export const toastConfig = {
  /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
  success: (prop: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#8720FE', backgroundColor: '#252836' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
        color: '#FFFFFF',
      }}
    />
  ),
};
