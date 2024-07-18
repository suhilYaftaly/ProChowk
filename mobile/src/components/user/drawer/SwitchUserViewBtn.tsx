import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { Button } from 'tamagui';
import { FontAwesome6 } from '@expo/vector-icons';
import { USER_VIEW } from '~/src/constants/localStorageKeys';
import { getValueFromLocalStorage } from '~/src/utils/secureStore';
import { useUserStates } from '~/src/redux/reduxStates';
import { isClient, isContractor, isUserClientAndContractor } from '~/src/utils/auth';
import { useAppDispatch } from '~/src/utils/hooks/hooks';
import { router } from 'expo-router';
import Routes from '~/src/routes/Routes';
import labels from '~/src/constants/labels';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

export type TUserView = 'Client' | 'Contractor';

interface Props {
  switchView: (view: TUserView) => void;
}

const SwitchUserViewBtn = ({ switchView }: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const dispatch = useAppDispatch();
  const savedView = getValueFromLocalStorage(USER_VIEW) as TUserView | null;
  const { user, userView } = useUserStates();
  const userTypes = user?.userTypes;

  //userType conditions
  const isVerifyEmail = isClient(userTypes) && !user?.emailVerified;
  const isBecomeContractor = isClient(userTypes) && !isContractor(userTypes);
  const isSwitchToCont = isUserClientAndContractor(userTypes) && userView === 'Client';
  const isSwitchToClient = isUserClientAndContractor(userTypes) && userView === 'Contractor';

  useEffect(() => {
    if (user && (isVerifyEmail || isBecomeContractor || !savedView)) {
      switchView('Client');
    } else if (user && savedView) switchView(savedView);
  }, [user]);

  const onVerifyEmail = () => {
    router.replace(`/${Routes.emailVerify}`);
  };
  const onBecomeContractor = () => {
    router.navigate(`/${Routes.profileSetup}?userType=contractor`);
  };

  const getBtnProps = () => {
    if (isVerifyEmail) {
      return {
        text: labels.verifyEmail,
        action: onVerifyEmail,
      };
    } else if (isBecomeContractor) {
      return {
        text: labels.becomeContractor,
        action: onBecomeContractor,
      };
    } else if (isSwitchToCont) {
      return {
        text: labels.switchToContractor,
        action: () => {
          router.replace(`/${Routes.contractorHome}`);
          switchView('Contractor');
        },
      };
    } else if (isSwitchToClient) {
      return {
        text: labels.switchToClient,
        action: () => {
          router.replace(`/${Routes.clientHome}`);
          switchView('Client');
        },
      };
    }
  };

  const btnProps = getBtnProps();

  if (!isClient(userTypes)) return null;

  return (
    <Button
      style={styles.switchBtn}
      borderColor={theme.primary}
      borderWidth={1}
      onPress={btnProps?.action}
      justifyContent="space-between"
      iconAfter={<FontAwesome6 name="circle-arrow-right" size={24} color={theme.primary} />}>
      {btnProps?.text}
    </Button>
  );
};

export default SwitchUserViewBtn;

const getStyles = (theme: any) =>
  StyleSheet.create({
    switchBtn: {
      fontFamily: 'InterBold',
      fontSize: 15,
      color: theme.textDark,
      backgroundColor: theme.white,
      borderColor: theme.primary,
      borderWidth: 1,
      borderBottomLeftRadius: 50,
      borderTopRightRadius: 50,
      borderTopLeftRadius: 50,
      borderBottomRightRadius: 50,
    },
  });
