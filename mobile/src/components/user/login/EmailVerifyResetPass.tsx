import { Pressable, StyleSheet, Text } from 'react-native';
import React from 'react';
import { Separator, YStack } from 'tamagui';
import { useUserStates } from '~/src/redux/reduxStates';
import { EmailVerify } from '../../reusable/CustomIcons';
import { useRequestPasswordReset } from '~/src/graphql/operations/user';
import Toast from 'react-native-toast-message';
import labels from '~/src/constants/labels';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

type Props = {
  email: string | string[];
};

const EmailVerifyResetPass = ({ email }: Props) => {
  const { user } = useUserStates();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { requestPasswordResetAsync } = useRequestPasswordReset();

  const resendEmail = () => {
    if (typeof email === 'string') {
      requestPasswordResetAsync({
        variables: { email: email },
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: `${labels.passResetMsg}`,
            position: 'top',
          });
        },
        onError: (err) => {
          Toast.show({
            type: 'error',
            text1: 'Error!',
            text2: `${err.message}`,
            position: 'top',
          });
        },
      });
    }
  };

  return (
    <YStack space={'$2'} style={styles.container}>
      <EmailVerify size={100} />
      <Text style={[styles.emailText, { fontSize: 22, fontFamily: 'InterBold' }]}>
        {labels.verificationSend}
      </Text>
      <Text style={[styles.emailText, { textAlign: 'center', width: '80%' }]}>
        {labels.weHaveSentText}{' '}
        <Text style={{ color: theme.textDark, fontFamily: 'InterBold' }}>{user?.email}. </Text>
        {labels.checkEmailText}
      </Text>
      <Separator alignSelf="stretch" marginHorizontal={10} marginVertical={10} />
      <Text style={styles.emailText}>{labels.didNotReceiveText}</Text>
      <Pressable onPress={() => resendEmail()}>
        <Text style={[styles.emailText, { color: theme.primary, fontFamily: 'InterBold' }]}>
          {labels.resendBtnText}
        </Text>
      </Pressable>
    </YStack>
  );
};

export default EmailVerifyResetPass;

const getStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.white,
      borderRadius: 10,
      padding: 20,
      elevation: 10,
      shadowColor: theme.black,
      shadowOffset: { height: 2, width: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 2,
      margin: 2,
      alignItems: 'center',
    },
    emailLogo: {
      height: 100,
      width: 100,
    },
    emailText: {
      fontFamily: 'InterSemiBold',
      fontSize: 17,
      color: theme.textBlue,
    },
    button: {
      fontFamily: 'InterBold',
      fontSize: 15,
      borderBottomLeftRadius: 50,
      borderTopRightRadius: 50,
      borderTopLeftRadius: 50,
      borderBottomRightRadius: 50,
      marginTop: 30,
      marginBottom: 10,
      justifyContent: 'center',
      color: '#fff',
      width: '80%',
    },
  });
