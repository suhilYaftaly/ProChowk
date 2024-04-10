import { Pressable, StyleSheet, Text } from 'react-native';
import React, { useEffect } from 'react';
import { Button, Separator, YStack } from 'tamagui';
import colors from '~/src/constants/colors';
import { useUserStates } from '~/src/redux/reduxStates';
import CustomIcons from '../../reusable/CustomIcons';
import { useAppDispatch } from '~/src/utils/hooks/hooks';
import { useSendVerificationEmail, useVerifyEmail } from '~/src/graphql/operations/user';
import { getLocalTokens } from '~/src/utils/auth';
import { setTokens, setUserProfile } from '~/src/redux/slices/userSlice';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import labels from '~/src/constants/labels';
import Routes from '~/src/routes/Routes';

const VerifyEmail = () => {
  const url = Linking.useURL();
  const { user } = useUserStates();
  const dispatch = useAppDispatch();

  const { verifyEmailAsync, data, error } = useVerifyEmail();
  const { sendVerificationEmailAsync, loading: resendLoading } = useSendVerificationEmail();
  const tokens = getLocalTokens();

  //verify token
  useEffect(() => {
    if (url) {
      const { queryParams } = Linking.parse(url);
      const token = queryParams?.token;
      if (token && typeof token === 'string') verifyEmailAsync({ variables: { token } });
    }
  }, [url]);

  //if token is verified then update user details and redirect screen
  useEffect(() => {
    if (!user?.emailVerified) {
      if (data && user) {
        dispatch(setUserProfile({ ...user, emailVerified: true }));
        dispatch(
          setTokens({
            accessToken: data.verifyEmail,
            refreshToken: tokens?.refreshToken,
          })
        );
        Toast.show({
          type: 'success',
          text1: `${labels.emailVerifySuccesss}`,
          position: 'top',
        });
        router.replace(`/${Routes.home}`);
      } else if (data) {
        Toast.show({
          type: 'success',
          text1: `${labels.emailVerifySuccesss}`,
          position: 'top',
        });
        router.replace(`/${Routes.login}`);
      }
    }
  }, [data]);

  //if logged in and email is verified then redirect screen
  useEffect(() => {
    if (user && user.emailVerified) router.navigate('/');
  }, [user]);

  const resendEmail = () => {
    if (user) {
      sendVerificationEmailAsync({
        variables: { email: user.email },
        onSuccess: () =>
          Toast.show({
            type: 'success',
            text1: `${labels.emailVerificationSent}`,
            position: 'top',
          }),
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
      <Button backgroundColor="$primary" style={styles.button} onPress={() => router.navigate('/')}>
        {labels.goHome}
      </Button>
    </YStack>
  );
};

export default VerifyEmail;

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
