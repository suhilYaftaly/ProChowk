import React, { useEffect, useState } from 'react';
import labels from '~/src/constants/labels';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Spinner, YStack } from 'tamagui';
import { Link, router } from 'expo-router';
import { useRegisterUser } from '~/src/graphql/operations/user';
import InputWithLabel from '../../reusable/InputWithLabel';
import { User, UserSchema } from '~/src/types/zodTypes';
import { useAppDispatch } from '~/src/utils/hooks/hooks';
import { logIn, userProfileBegin, userProfileError } from '~/src/redux/slices/userSlice';
import Routes from '~/src/routes/Routes';
import Toast from 'react-native-toast-message';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

const UserSignUp = () => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isNameValid, setIsNameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPassValid, setIsPassValid] = useState(true);
  const [isConfirmPassValid, setIsConfirmPassValid] = useState(true);
  const [disableSignUpBtn, setDisableSignUpBtn] = useState(false);
  const [passVisible, setPassVisible] = useState(true);

  const sendData = () => {
    const userDetails: User = {
      name,
      email,
      password,
    };
    if (validateUser(userDetails)) {
      setDisableSignUpBtn(true);
      dispatch(userProfileBegin());
      registerUserAsync({
        variables: userDetails,
        onSuccess: (d) => {
          setDisableSignUpBtn(false);
          dispatch(logIn(d));
          router.replace(`/${Routes.profileSetup}`);
        },
        onError: (err) => {
          dispatch(userProfileError({ message: err?.message }));
          setDisableSignUpBtn(false);
        },
      });
    }
  };

  const validateUser = (userData: User): boolean => {
    const validationData = UserSchema.safeParse(userData);
    if (!validationData?.success) {
      validationData?.error?.issues?.map((issue) => {
        switch (issue?.path?.[0]) {
          case 'name':
            setIsNameValid(false);
            break;
          case 'email':
            setIsEmailValid(false);
            break;
          case 'password':
            setIsPassValid(false);
            break;
        }
      });
      return false;
    } else if (validationData?.success && password !== confirmPass) {
      setIsConfirmPassValid(false);
      return false;
    }
    return true;
  };

  const { registerUserAsync, loading, error } = useRegisterUser();

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: 'Error!',
        text2: `${error.message}`,
        position: 'top',
      });
    }
  }, [error]);

  return (
    <View style={styles.formCont}>
      <View style={styles.formHeader}>
        <Text style={styles.headerText}>{labels.signUp}</Text>
        <Text style={styles.subHeaderText}>{labels.signUpSubText}</Text>
      </View>
      <View>
        <YStack space={'$4'} marginTop={20}>
          <InputWithLabel
            labelText={labels.name}
            placeholder={labels.placeName}
            value={name}
            onChange={(e) => {
              setName(e);
              setIsNameValid(true);
            }}
            isError={isNameValid}
            errorText={labels.nameError}
          />
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
              setPassWord(e);
              setIsPassValid(true);
            }}
            isSecret={true}
            isError={isPassValid}
            errorText={labels.passwordError}
            hidePass={passVisible}
            setHidePass={(val: boolean) => setPassVisible(val)}
          />
          <InputWithLabel
            labelText={labels.confirmPassword}
            placeholder={labels.confirmPassword}
            value={confirmPass}
            onChange={(e) => {
              setConfirmPass(e);
              setIsConfirmPassValid(true);
            }}
            isSecret={true}
            isError={isConfirmPassValid}
            errorText={labels.confirmPasswordError}
            hidePass={passVisible}
            setHidePass={(val: boolean) => setPassVisible(val)}
          />
        </YStack>
        <Button
          onPress={() => sendData()}
          backgroundColor={disableSignUpBtn ? theme.border : theme.primary}
          color={disableSignUpBtn ? theme.silver : '#fff'}
          style={styles.button}
          disabled={disableSignUpBtn}
          icon={loading ? () => <Spinner /> : undefined}>
          {labels.signUp}
        </Button>
      </View>
      <View style={styles.formHeader}>
        <Text style={styles.subHeaderText}>
          {labels.alreadyHaveAnAccount}{' '}
          <Link href={`/${Routes.login}`} replace asChild>
            <Text style={{ color: theme.primary, textDecorationLine: 'underline' }}>
              {labels.signInNow}
            </Text>
          </Link>
        </Text>
        <Text style={styles.footerText}>{labels.bySignedIn}</Text>
        <Text
          style={{
            color: theme.secondaryDark,
            fontSize: 11,
            fontFamily: 'InterBold',
            textDecorationLine: 'underline',
          }}>
          {labels.termsText}
        </Text>
      </View>
    </View>
  );
};

export default UserSignUp;

const getStyles = (theme: any) =>
  StyleSheet.create({
    formCont: {
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
    formHeader: {
      alignItems: 'center',
    },
    headerText: { fontSize: 20, fontFamily: 'InterExtraBold', color: theme.textDark },
    subHeaderText: {
      fontSize: 13,
      color: theme.silver,
      marginTop: 10,
      fontFamily: 'InterSemiBold',
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
    },
    footerText: { fontSize: 11, color: theme.silver, marginTop: 20, fontFamily: 'InterSemiBold' },
  });
