import { Pressable, StyleSheet, Text } from 'react-native';
import React from 'react';
import { Separator, YStack } from 'tamagui';
import colors from '~/src/constants/colors';
import { useUserStates } from '~/src/redux/reduxStates';
import CustomIcons from '../../reusable/CustomIcons';
import { useRequestPasswordReset } from '~/src/graphql/operations/user';
import Toast from 'react-native-toast-message';
import labels from '~/src/constants/labels';

type Props = {
  email: string | string[];
};

const EmailVerifyResetPass = ({ email }: Props) => {
  const { user } = useUserStates();

  const { requestPasswordResetAsync } = useRequestPasswordReset();

  const resendEmail = () => {
    if (typeof email === 'string') {
      requestPasswordResetAsync({
        variables: { email: email },
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: `Password reset request sent to your email. Please check your email.`,
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
      <CustomIcons name="emailVerify" size={100} />
      <Text style={[styles.emailText, { fontSize: 22, fontFamily: 'InterBold' }]}>
        {labels.verificationSend}
      </Text>
      <Text style={[styles.emailText, { textAlign: 'center', width: '80%' }]}>
        {labels.weHaveSentText}{' '}
        <Text style={{ color: colors.textDark, fontFamily: 'InterBold' }}>{user?.email}. </Text>
        {labels.checkEmailText}
      </Text>
      <Separator alignSelf="stretch" marginHorizontal={10} marginVertical={10} />
      <Text style={styles.emailText}>{labels.didNotReceiveText}</Text>
      <Pressable onPress={() => resendEmail()}>
        <Text style={[styles.emailText, { color: colors.primary, fontFamily: 'InterBold' }]}>
          {labels.resendBtnText}
        </Text>
      </Pressable>
    </YStack>
  );
};

export default EmailVerifyResetPass;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
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
    color: colors.textBlue,
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
    color: colors.white,
    width: '80%',
  },
});
