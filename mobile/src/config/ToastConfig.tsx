import { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message';
import colors from '../constants/colors';
import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';

export const toastConfig = {
  /*
      Overwrite 'success' type,
      by modifying the existing `BaseToast` component
    */
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.success,
        backgroundColor: colors.success,
        alignItems: 'center',
        paddingLeft: 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      renderLeadingIcon={() => <AntDesign name="checkcircle" size={24} color={colors.white} />}
      text1Style={{
        fontSize: 18,
        fontWeight: '700',
        color: colors.white,
        fontFamily: 'InterBold',
      }}
      text2Style={{
        fontSize: 16,
        fontWeight: '600',
        color: colors.white,
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
      style={{
        borderLeftColor: colors.error,
        backgroundColor: colors.error,
        alignItems: 'center',
        paddingLeft: 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      renderLeadingIcon={() => <MaterialIcons name="error" size={24} color={colors.white} />}
      text1Style={{
        fontSize: 18,
        fontWeight: '700',
        color: colors.white,
        fontFamily: 'InterBold',
      }}
      text2Style={{
        fontSize: 16,
        fontWeight: '600',
        color: colors.white,
        fontFamily: 'InterSemiBold',
      }}
    />
  ),
  info: (props: any) => (
    <InfoToast
      {...props}
      style={{
        borderLeftColor: colors.info,
        backgroundColor: colors.info,
        alignItems: 'center',
        paddingLeft: 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      renderLeadingIcon={() => <Entypo name="info-with-circle" size={24} color={colors.white} />}
      text1Style={{
        fontSize: 18,
        fontWeight: '700',
        color: colors.white,
        fontFamily: 'InterBold',
      }}
      text2Style={{
        fontSize: 16,
        fontWeight: '600',
        color: colors.white,
        fontFamily: 'InterSemiBold',
      }}
    />
  ),
  warning: (props: any) => (
    <InfoToast
      {...props}
      style={{
        borderLeftColor: colors.warning,
        backgroundColor: colors.warning,
        alignItems: 'center',
        paddingLeft: 10,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      renderLeadingIcon={() => <AntDesign name="warning" size={24} color={colors.white} />}
      text1Style={{
        fontSize: 18,
        fontWeight: '700',
        color: colors.white,
        fontFamily: 'InterBold',
      }}
      text2Style={{
        fontSize: 16,
        fontWeight: '600',
        color: colors.white,
        fontFamily: 'InterSemiBold',
      }}
    />
  ),
};
