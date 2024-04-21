import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserStates } from '~/src/redux/reduxStates';
import colors from '~/src/constants/colors';
import { Button } from 'tamagui';
import labels from '~/src/constants/labels';
import { router } from 'expo-router';
import Routes from '~/src/routes/Routes';
import { Drawer } from '../reusable/CustomIcons';

const AppHeader = (props: any) => {
  const { top } = useSafeAreaInsets();
  const { userId } = useUserStates();
  return (
    <View style={[styles.headerBar, { marginTop: top }]}>
      <Text style={styles.appName}>
        {labels.nexa}
        <Text style={{ color: colors.white }}>{labels.bind}</Text>.
      </Text>
      {userId ? (
        <Pressable onPress={() => props.navigation.openDrawer()}>
          <Drawer size={23} color={colors.white} />
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

export default AppHeader;

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.textDark,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  appName: {
    fontFamily: 'InterExtraBold',
    fontSize: 25,
    color: colors.primary,
  },
  signInBtn: {
    backgroundColor: colors.primary,
    fontSize: 15,
    fontFamily: 'InterBold',
    color: colors.white,
    borderBottomLeftRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
});
