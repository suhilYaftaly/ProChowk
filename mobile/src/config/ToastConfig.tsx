import { BaseToast, ErrorToast } from 'react-native-toast-message';
import colors from '../constants/colors';

export const toastConfig = {
  /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: colors.success }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 18,
        fontWeight: '700',
        fontFamily: 'InterBold',
      }}
      text2Style={{
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'InterSemiBold',
      }}
    />
  ),
  /*
      Overwrite 'error' type,
      by modifying the existing `ErrorToast` component
    */
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: colors.error }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 18,
        fontWeight: '700',
        fontFamily: 'InterBold',
      }}
      text2Style={{
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'InterSemiBold',
      }}
    />
  ),
};
