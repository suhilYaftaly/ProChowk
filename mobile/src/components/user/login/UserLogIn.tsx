import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Spinner, YStack } from 'tamagui';
import InputWithLabel from '../../reusable/InputWithLabel';
import labels from '~/src/constants/labels';
import { Link, router } from 'expo-router';
import { useGLogin, useLoginUser } from '~/src/graphql/operations/user';
import { Google } from '../../reusable/CustomIcons';
import Routes from '~/src/routes/Routes';
import { useAppDispatch } from '~/src/utils/hooks/hooks';
import { LoginSchema, LoginUser } from '~/src/types/zodTypes';
import { logIn, userProfileBegin, userProfileError } from '~/src/redux/slices/userSlice';
/* import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin'; */
import Toast from 'react-native-toast-message';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

const UserLogIn = () => {
  const dispatch = useAppDispatch();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [isPassValid, setIsPassValid] = useState<boolean>(true);
  const [isPassVisible, setIsPassVisible] = useState<boolean>(true);
  const { loginUserAsync, loading, error } = useLoginUser();
  const { googleLoginAsync, loading: GoogleLoading, error: GoogleError } = useGLogin();
  const [disableSignInBtn, setDisableSignInBtn] = useState(false);
  /*  const configureGoogleLogIn = () => {
    GoogleSignin?.configure({
      webClientId: process.env.GOOGLE_CLIENT_ID,
    });
  };

  useEffect(() => {
    configureGoogleLogIn();
  }, []);

  const googleSignIn = async () => {
    try {
      await GoogleSignin?.hasPlayServices();
      const userInfo = await GoogleSignin?.signIn();
      if (userInfo && userInfo?.user?.id) {
        const userTokens = await GoogleSignin?.getTokens();
        if (userTokens?.accessToken) {
          dispatch(userProfileBegin());
          googleLoginAsync({
            variables: { accessToken: userTokens?.accessToken, client: Platform?.OS },
            onSuccess: (d) => {
              dispatch(logIn(d));
              router.replace(`/`);
            },
            onError: (err) => dispatch(userProfileError({ message: err?.message })),
          });
        }
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        Toast.show({
          type: 'error',
          text1: 'Error!',
          text2: 'Login flow cancelled',
          position: 'top',
        });
      } else {
        // some other error happened
        Toast.show({
          type: 'error',
          text1: 'Error!',
          text2: `${error?.message}`,
          position: 'top',
        });
      }
    }
  };
 */
  const signIn = async (): Promise<void> => {
    const logInDetails: LoginUser = {
      email,
      password,
    };
    if (validateLogin(logInDetails)) {
      setDisableSignInBtn(true);

      dispatch(userProfileBegin());
      loginUserAsync({
        variables: { email: logInDetails.email, password: logInDetails.password },
        onSuccess: (d) => {
          dispatch(logIn(d));
          if (d?.emailVerified) {
            router.replace(`/${Routes.home}`);
          } else {
            router.replace(`/${Routes.emailVerify}`);
          }
        },
        onError: (err) => {
          dispatch(userProfileError({ message: err?.message }));
          setDisableSignInBtn(false);
        },
      });
    }
  };

  const validateLogin = (logInData: LoginUser): boolean => {
    const validationData = LoginSchema.safeParse(logInData);
    if (!validationData?.success) {
      validationData?.error?.issues?.map((issue) => {
        switch (issue?.path?.[0]) {
          case 'email':
            setIsEmailValid(false);
            break;
          case 'password':
            setIsPassValid(false);
            break;
        }
      });
      return false;
    }
    return true;
  };

  return (
    <YStack space={'$1.5'} style={styles.logInCont}>
      <Text style={styles.welcomeNexaText}>
        {labels.welcomeTo} <Text style={{ color: theme.primary }}>{labels.appName}</Text>.
      </Text>
      <Text style={styles.subHeaderText}>{labels.enterCredentials}</Text>
      <YStack space={'$2.5'} style={styles.formCont}>
        <InputWithLabel
          labelText={labels.email}
          placeholder={labels.placeEmail}
          value={email}
          onChange={(e) => {
            setEmail(e);
            setIsEmailValid(true);
          }}
          isError={isEmailValid}
          errorText={labels.emailError}
        />
        <InputWithLabel
          labelText={labels.password}
          placeholder={labels.password}
          value={password}
          onChange={(e) => {
            setPassword(e);
            setIsPassValid(true);
          }}
          isSecret={true}
          isError={isPassValid}
          errorText={labels.passwordError}
          hidePass={isPassVisible}
          setHidePass={(val: boolean) => setIsPassVisible(val)}
        />
        <Pressable onPress={() => router.navigate(`/${Routes.forgotPassword}`)}>
          <Text style={styles.forgetPassText}>{labels.forgotPass}?</Text>
        </Pressable>
      </YStack>
      <YStack space={'$3'}>
        <Button
          onPress={() => signIn()}
          backgroundColor={disableSignInBtn ? theme.border : theme.primary}
          color={disableSignInBtn ? theme.silver : '#fff'}
          style={styles.button}
          disabled={disableSignInBtn}
          icon={loading ? () => <Spinner /> : undefined}>
          {labels.logIn}
        </Button>
        <Text style={styles.signUpText}>
          {labels.newAtNexaBind}?{' '}
          <Link href={`/${Routes.signup}`} replace asChild>
            <Text style={{ color: theme.primary, textDecorationLine: 'underline' }}>
              {labels.signUpNow}
            </Text>
          </Link>
        </Text>
        <Text style={[styles.signUpText, { fontSize: 17 }]}>Or</Text>
        <Button
          style={styles.googleSignInBtn}
          borderColor={theme.bg}
          borderWidth={1}
          disabled={GoogleLoading}
          icon={GoogleLoading ? () => <Spinner /> : undefined}
          onPress={() => /*  googleSignIn() */ {}}>
          <Google size={30} />
          <Text style={styles.googleBtnText}>{labels.signInWithGoogle}</Text>
        </Button>
      </YStack>
    </YStack>
  );
};

export default UserLogIn;

const getStyles = (theme: any) =>
  StyleSheet.create({
    logInCont: {
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
    welcomeNexaText: {
      fontSize: 22,
      fontFamily: 'InterExtraBold',
      textAlign: 'center',
      color: theme.textDark,
    },
    subHeaderText: {
      fontSize: 13,
      color: theme.silver,
      textAlign: 'center',
      fontFamily: 'InterSemiBold',
    },
    formCont: {
      marginVertical: 20,
      padding: 10,
    },
    forgetPassText: {
      fontSize: 13,
      color: theme.textBlue,
      textAlign: 'right',
      fontFamily: 'InterSemiBold',
    },
    button: {
      fontFamily: 'InterBold',
      fontSize: 15,

      borderBottomLeftRadius: 50,
      borderTopRightRadius: 50,
      borderTopLeftRadius: 50,
      borderBottomRightRadius: 50,
      marginBottom: 10,
      justifyContent: 'center',
    },
    signUpText: {
      fontSize: 13,
      color: theme.textBlue,
      textAlign: 'center',
      fontFamily: 'InterSemiBold',
    },
    googleSignInBtn: {
      height: 60,
      backgroundColor: theme.bg,
      borderBottomLeftRadius: 50,
      borderTopRightRadius: 50,
      borderTopLeftRadius: 50,
      borderBottomRightRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    googleBtnText: {
      fontSize: 17,
      color: theme.textBlue,
      fontFamily: 'InterBold',
    },
  });
