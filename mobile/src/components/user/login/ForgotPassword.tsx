import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Button, Spinner, YStack } from 'tamagui';
import InputWithLabel from '../../reusable/InputWithLabel';
import labels from '~/src/constants/labels';
import colors from '~/src/constants/colors';
import { useRequestPasswordReset } from '~/src/graphql/operations/user';
import { z } from 'zod';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import Routes from '~/src/routes/Routes';
import { ForgotPassword as FPSvg } from '../../reusable/CustomIcons';

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>('');
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [disableProceed, setDisableProceeed] = useState<boolean>(false);

  const {
    requestPasswordResetAsync,
    loading: reqLoading,
    error: reqError,
    data: reqData,
  } = useRequestPasswordReset();

  const sendVerificationEmail = () => {
    const emailSchema = z.string().email();
    const isValidEmailFormat = emailSchema.safeParse(email);
    if (!isValidEmailFormat?.success) {
      setIsEmailValid(false);
      return;
    }
    if (email) {
      setDisableProceeed(true);
      requestPasswordResetAsync({
        variables: { email: email },
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: `${labels.passResetMsg}`,
            position: 'top',
          });
          router.replace({ pathname: `/${Routes.resetPassEmailVerify}`, params: { email: email } });
        },
        onError: (err) => {
          Toast.show({
            type: 'error',
            text1: 'Error!',
            text2: `${err.message}`,
            position: 'top',
          });
          setDisableProceeed(false);
        },
      });
    } /* router.replace({ pathname: `/${Routes.resetPassEmailVerify}`, params: { email: email } }); */
    router.navigate('/changePass');
  };
  return (
    <YStack space={'$4'} style={styles.container}>
      <View style={styles.textContainer}>
        <FPSvg size={100} />
        <Text style={styles.headerText}>{labels.forgotPassword}</Text>
        <Text style={styles.normalText}>{labels.enterEmailBelow}</Text>
        <Text style={styles.normalText}>{labels.googleEmailWarning}</Text>
      </View>
      <InputWithLabel
        labelText={labels.enterEmail}
        placeholder={labels.placeEmail}
        value={email}
        onChange={(e) => {
          setEmail(e);
          setIsEmailValid(true);
        }}
        isError={isEmailValid}
        errorText={labels.emailError}
      />
      <Button
        onPress={() => sendVerificationEmail()}
        backgroundColor={disableProceed ? '$border' : '$primary'}
        color={disableProceed ? '$silver' : '$white'}
        style={styles.button}
        disabled={disableProceed}
        icon={reqLoading ? () => <Spinner /> : undefined}>
        {labels.proceed}
      </Button>
    </YStack>
  );
};

export default ForgotPassword;

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
  },
  headerText: {
    fontFamily: 'InterExtraBold',
    fontSize: 20,
    textAlign: 'center',
    color: colors.textBlue,
    marginBottom: 10,
    marginTop: 10,
  },
  button: {
    fontFamily: 'InterBold',
    fontSize: 15,
    borderBottomLeftRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    borderBottomRightRadius: 50,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  normalText: {
    fontFamily: 'InterSemiBold',
    fontSize: 13,
    textAlign: 'center',
    color: colors.textDark,
    marginBottom: 10,
    marginTop: 10,
  },
});
