import { Pressable, StyleSheet, Text } from 'react-native';
import React, { useEffect } from 'react';
import { Button, Separator, YStack } from 'tamagui';
import colors from '~/src/constants/colors';
import { useUserStates } from '~/src/redux/reduxStates';
import CustomIcons from '../reusable/CustomIcons';
import { useAppDispatch } from '~/src/utils/hooks/hooks';
import { useSendVerificationEmail, useVerifyEmail } from '~/src/graphql/operations/user';
import { getLocalTokens } from '~/src/utils/auth';
import { setTokens, setUserProfile } from '~/src/redux/slices/userSlice';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import { USER_PROFILE_KEY } from '~/src/constants/localStorageKeys';
import labels from '~/src/constants/labels';

const VerifyEmail = () => {
  const { user } = useUserStates();
  const dispatch = useAppDispatch();
  /*   const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token'); */
  const { verifyEmailAsync, data, error } = useVerifyEmail();
  const { sendVerificationEmailAsync, loading: resendLoading } = useSendVerificationEmail();
  const tokens = getLocalTokens();
  const token = tokens?.accessToken;
  //verify token
  /*  useEffect(() => {
    if (token) verifyEmailAsync({ variables: { token } });
  }, [token]);
 */
  //if token is verified then update user details and redirect screen
  useEffect(() => {
    if (token && !user?.emailVerified) {
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
        router.navigate('/');
      } else if (data) {
        Toast.show({
          type: 'success',
          text1: `${labels.emailVerifySuccesss}`,
          position: 'top',
        });
        router.navigate('/login');
      }
    }
  }, [data]);

  //if logged in and email is verified then redirect screen
  useEffect(() => {
    if (user && user.emailVerified) router.navigate('/');
  }, [user]);

  //if user email is updated from another tab using localStorage then apply it to this tab as well
  /*   useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === USER_PROFILE_KEY && e.newValue) {
        const updatedUser = JSON.parse(e.newValue);
        if (updatedUser && updatedUser.emailVerified && !user?.emailVerified) {
          dispatch(setUserProfileInfo(updatedUser));
          navigate('/');
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [dispatch, navigate]); */

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
    <YStack
      space={'$2'}
      backgroundColor={'$white'}
      alignItems="center"
      borderRadius={10}
      paddingHorizontal={10}
      paddingVertical={20}>
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
    borderRadius: 50,
    marginTop: 30,
    marginBottom: 10,
    justifyContent: 'center',
    color: colors.white,
    width: '80%',
  },
});
