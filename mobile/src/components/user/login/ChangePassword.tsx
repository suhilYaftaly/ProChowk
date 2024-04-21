import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Button, Spinner, YStack } from 'tamagui';
import InputWithLabel from '../../reusable/InputWithLabel';
import labels from '~/src/constants/labels';
import colors from '~/src/constants/colors';
import { z } from 'zod';
import { useResetPassword } from '~/src/graphql/operations/user';
import { useAppDispatch } from '~/src/utils/hooks/hooks';
import { router } from 'expo-router';
import { logIn } from '~/src/redux/slices/userSlice';
import Toast from 'react-native-toast-message';

const ChangePassword = () => {
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState<string>('');
  const [confirmPass, setConfirmPass] = useState<string>('');
  const [isPassValid, setIsPassValid] = useState<boolean>(true);
  const [isConfirmPassValid, setIsConfirmPassValid] = useState<boolean>(true);
  const [isPassVisible, setIsPassVisible] = useState<boolean>(true);
  const [disableProceed, setDisableProceeed] = useState<boolean>(false);

  const { resetPasswordAsync, loading: resetLoading, error: resetError } = useResetPassword();

  const token: string = ''; //TODO: integrate this with deep linking password change link token

  const resetPassword = () => {
    if (validateResetPassFields()) {
      setDisableProceeed(true);
      resetPasswordAsync({
        variables: { token, newPassword: password },
        onSuccess: (dt) => {
          dispatch(logIn(dt));
          Toast.show({
            type: 'success',
            text1: `${labels.passResetSuccess}`,
            position: 'top',
          });
          router.replace('/');
        },
      });
    }
  };

  const validateResetPassFields = () => {
    const passSchema = z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g);
    const passValidation = passSchema.safeParse(password);
    if (!passValidation?.success) {
      setIsPassValid(false);
      return false;
    } else if (passValidation?.success && password !== confirmPass) {
      setIsConfirmPassValid(false);
      return false;
    }
    return true;
  };

  return (
    <YStack space={'$4'} style={styles.container}>
      <Text style={styles.headerText}>{labels.setNewPass}</Text>

      <InputWithLabel
        labelText={labels.newPassword}
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
        hidePass={isPassVisible}
        setHidePass={(val: boolean) => setIsPassVisible(val)}
      />

      <Button
        onPress={() => resetPassword()}
        backgroundColor={disableProceed ? '$border' : '$primary'}
        color={disableProceed ? '$silver' : '$white'}
        style={styles.button}
        disabled={disableProceed}
        icon={resetLoading ? () => <Spinner /> : undefined}>
        {labels.setItNow}
      </Button>
    </YStack>
  );
};

export default ChangePassword;

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
});
