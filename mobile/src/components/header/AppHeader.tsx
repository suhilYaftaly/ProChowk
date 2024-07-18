import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserStates } from '~/src/redux/reduxStates';
import { Button } from 'tamagui';
import labels from '~/src/constants/labels';
import { router } from 'expo-router';
import Routes from '~/src/routes/Routes';
import { Drawer } from '../reusable/CustomIcons';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

const AppHeader = (props: any) => {
  const { top } = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { userId } = useUserStates();
  return (
    <View style={[styles.headerBar, { marginTop: top }]}>
      <Text style={styles.appName}>
        {labels.nexa}
        <Text style={{ color: '#fff' }}>{labels.bind}</Text>.
      </Text>
      {userId ? (
        <Pressable onPress={() => props.navigation.openDrawer()}>
          <Drawer size={23} color="#fff" />
        </Pressable>
      ) : (
        <Button
          height={'$3'}
          style={styles.signInBtn}
          onPress={() => router.navigate(`/${Routes.login}`)}>
          {labels.logIn}
        </Button>
      )}
    </View>
  );
};

export default React.memo(AppHeader);

const getStyles = (theme: any) =>
  StyleSheet.create({
    headerBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.secondaryDark,
      paddingHorizontal: 15,
      paddingVertical: 15,
    },
    appName: {
      fontFamily: 'InterExtraBold',
      fontSize: 25,
      color: theme.primary,
    },
    signInBtn: {
      backgroundColor: theme.primary,
      fontSize: 15,
      fontFamily: 'InterBold',
      color: '#fff',
      borderBottomLeftRadius: 50,
      borderTopRightRadius: 50,
      borderTopLeftRadius: 50,
      borderBottomRightRadius: 50,
    },
  });
