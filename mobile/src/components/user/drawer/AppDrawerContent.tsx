import { FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Link, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, Button, Separator, Switch, XStack, YStack } from 'tamagui';
import labels from '~/src/constants/labels';
import { useSettingsStates, useUserStates } from '~/src/redux/reduxStates';
import { logOut, setUserView } from '~/src/redux/slices/userSlice';
import Routes from '~/src/routes/Routes';
import { useAppDispatch } from '~/src/utils/hooks/hooks';
import SwitchUserViewBtn, { TUserView } from './SwitchUserViewBtn';
import React from 'react';
import { BidJob } from '../../reusable/CustomIcons';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
import { saveInLocalStorage } from '~/src/utils/secureStore';
import { THEME_KEY, USER_VIEW } from '~/src/constants/localStorageKeys';

const AppDrawerContent = (props: any) => {
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useAppTheme();
  const styles = getStyles(theme);
  const { user, userView } = useUserStates();
  const { top, bottom } = useSafeAreaInsets();
  const { colorMode } = useSettingsStates();

  const handleLogOut = async () => {
    switchView('Client');
    if (colorMode === 'dark') toggleTheme();
    dispatch(logOut());
    props.navigation.closeDrawer();
  };

  const switchView = (newView: TUserView) => {
    saveInLocalStorage(USER_VIEW, newView);
    props.navigation.closeDrawer();
    if (newView === 'Contractor') router.navigate(`/${Routes.contractorHome}`);
    else if (newView === 'Client') router.navigate(`/${Routes.clientHome}`);
    dispatch(setUserView(newView));
  };

  return (
    <View style={styles.drawerCont}>
      <Link href={`/user/${user?.id}`} asChild>
        <Pressable>
          <View style={[styles.profileCont, { marginTop: top }]}>
            <Avatar circular size="$6">
              {user?.image ? (
                <Avatar.Image accessibilityLabel={user?.name} src={user?.image?.url} />
              ) : (
                <Avatar.Image
                  accessibilityLabel="default"
                  src={require('@assets/images/userDummy.png')}
                />
              )}
            </Avatar>
            <YStack space={'$2'} marginLeft={10} style={{ width: '75%' }}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={{ color: theme.textDark, fontFamily: 'InterBold', fontSize: 15 }}>
                {userView}
              </Text>
            </YStack>
          </View>
        </Pressable>
      </Link>
      <Separator borderColor={theme.border} />
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        <YStack>
          <XStack padding={20} jc={'space-between'}>
            <Text style={styles.drawerOptionText}>{labels.darkMode}</Text>
            <Switch
              size={'$3'}
              checked={colorMode === 'dark' ? true : false}
              onCheckedChange={() => toggleTheme()}
              backgroundColor={theme.bg}
              borderColor={theme.bg}
              justifyContent="center">
              <Switch.Thumb
                animation="quicker"
                backgroundColor={theme.white}
                shadowColor={theme.textDark}
              />
            </Switch>
          </XStack>
          <Separator borderColor={theme.border} />
          <Pressable onPress={() => router.navigate(`/${Routes.jobList}`)}>
            <XStack padding={20} alignItems="center">
              <FontAwesome6
                name="suitcase"
                size={28}
                color={theme.textDark}
                style={styles.drawerItemIcon}
              />
              <Text style={styles.drawerOptionText}>{labels.yourJobs}</Text>
            </XStack>
          </Pressable>
          <Separator borderColor={theme.border} />
          <XStack padding={20} alignItems="center">
            <View style={{ marginRight: 15 }}>
              <BidJob size={35} color={theme.textDark} />
            </View>
            <Text style={styles.drawerOptionText}>{labels.yourBids}</Text>
          </XStack>
          <Separator borderColor={theme.border} />
          <Pressable onPress={() => handleLogOut()}>
            <XStack padding={20} alignItems="center">
              <MaterialIcons
                name="logout"
                size={30}
                color={theme.textDark}
                style={styles.drawerItemIcon}
              />
              <Text style={styles.drawerOptionText}>{labels.logOut}</Text>
            </XStack>
          </Pressable>
          <Separator borderColor={theme.border} />
        </YStack>
      </DrawerContentScrollView>
      <View style={[styles.drawerFooter, { paddingBottom: bottom + 10 }]}>
        <SwitchUserViewBtn switchView={(newView: TUserView) => switchView(newView)} />
      </View>
    </View>
  );
};
export default React.memo(AppDrawerContent);

const getStyles = (theme: any) =>
  StyleSheet.create({
    drawerCont: {
      flex: 1,
      backgroundColor: theme.white,
    },
    profileCont: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
    },
    userName: {
      fontFamily: 'InterBold',
      fontSize: 18,
      color: theme.textDark,
    },
    drawerOptionText: {
      fontFamily: 'InterBold',
      fontSize: 18,
      color: theme.textDark,
    },
    drawerItemIcon: {
      marginRight: 20,
    },
    drawerFooter: {
      paddingLeft: 20,
      paddingRight: 20,
    },
  });
