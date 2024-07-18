import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Button, Spinner, YStack } from 'tamagui';
import InputWithLabel from '../../reusable/InputWithLabel';
import labels from '~/src/constants/labels';
import { useRequestPasswordReset } from '~/src/graphql/operations/user';
import { z } from 'zod';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import Routes from '~/src/routes/Routes';
import { ForgotPassword as FPSvg } from '../../reusable/CustomIcons';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

const ForgotPassword = () => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
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
        <FPSvg size={100} color={theme.black} />
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
        backgroundColor={disableProceed ? theme.border : theme.primary}
        color={disableProceed ? theme.silver : '#fff'}
        style={styles.button}
        disabled={disableProceed}
        icon={reqLoading ? () => <Spinner /> : undefined}>
        {labels.proceed}
      </Button>
    </YStack>
  );
};

export default ForgotPassword;

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
    },
    headerText: {
      fontFamily: 'InterExtraBold',
      fontSize: 20,
      textAlign: 'center',
      color: theme.textBlue,
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
      color: theme.textDark,
      marginBottom: 10,
      marginTop: 10,
    },
  });
