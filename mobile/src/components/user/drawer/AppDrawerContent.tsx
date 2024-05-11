import { FontAwesome6, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Link, router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, Button, Separator, Switch, XStack, YStack } from 'tamagui';
import colors from '~/src/constants/colors';
import labels from '~/src/constants/labels';
import { useUserStates } from '~/src/redux/reduxStates';
import { logOut } from '~/src/redux/slices/userSlice';
import Routes from '~/src/routes/Routes';
import { useAppDispatch } from '~/src/utils/hooks/hooks';
import SwitchUserViewBtn from './SwitchUserViewBtn';

const AppDrawerContent = (props: any) => {
  const dispatch = useAppDispatch();
  const { user } = useUserStates();
  const { top, bottom } = useSafeAreaInsets();

  const handleLogOut = async () => {
    dispatch(logOut());
    props.navigation.closeDrawer();
    router.replace(`/${Routes.home}`);
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
            <YStack space={'$2'} marginLeft={10}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={{ color: colors.textDark, fontFamily: 'InterBold', fontSize: 15 }}>
                {user?.contractor ? labels.contractor : labels.client}
              </Text>
            </YStack>
          </View>
        </Pressable>
      </Link>
      <Separator borderColor={colors.border} />
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        <YStack>
          <XStack padding={20} jc={'space-between'}>
            <Text style={styles.drawerOptionText}>{labels.darkMode}</Text>
            <Switch
              size={'$3'}
              checked={true}
              onCheckedChange={() => {}}
              backgroundColor={colors.bg}
              borderColor={colors.bg}
              justifyContent="center">
              <Switch.Thumb
                animation="quicker"
                backgroundColor={colors.white}
                shadowColor={colors.textDark}
              />
            </Switch>
          </XStack>
          <Separator borderColor={colors.border} />
          <XStack padding={20} alignItems="center">
            <FontAwesome6
              name="suitcase"
              size={28}
              color={colors.textDark}
              style={styles.drawerItemIcon}
            />
            <Text style={styles.drawerOptionText}>{labels.yourJobs}</Text>
          </XStack>
          <Separator borderColor={colors.border} />
          <XStack padding={20} alignItems="center">
            <Ionicons
              name="chatbubble-ellipses"
              size={30}
              color={colors.textDark}
              style={styles.drawerItemIcon}
            />
            <Text style={styles.drawerOptionText}>{labels.messages}</Text>
          </XStack>
          <Separator borderColor={colors.border} />
          <Pressable onPress={() => handleLogOut()}>
            <XStack padding={20} alignItems="center">
              <MaterialIcons
                name="logout"
                size={30}
                color={colors.textDark}
                style={styles.drawerItemIcon}
              />
              <Text style={styles.drawerOptionText}>{labels.logOut}</Text>
            </XStack>
          </Pressable>
          <Separator borderColor={colors.border} />
        </YStack>
      </DrawerContentScrollView>
      <View style={[styles.drawerFooter, { paddingBottom: bottom + 10 }]}>
        <SwitchUserViewBtn />
      </View>
    </View>
  );
};
export default AppDrawerContent;

const styles = StyleSheet.create({
  drawerCont: {
    flex: 1,
  },
  profileCont: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  userName: {
    fontFamily: 'InterBold',
    fontSize: 18,
    color: colors.textDark,
  },
  drawerOptionText: {
    fontFamily: 'InterBold',
    fontSize: 18,
    color: colors.textDark,
  },
  drawerItemIcon: {
    marginRight: 20,
  },
  drawerFooter: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});
