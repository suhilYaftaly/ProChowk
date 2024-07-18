import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
import { useUserStates } from '~/src/redux/reduxStates';
import {
  TNotification,
  useMarkAllNotificationsAsRead,
  useUserNotifications,
} from '~/src/graphql/operations/notification';
import CustomContentLoader from '../../reusable/CustomContentLoader';
import { Button, ScrollView } from 'tamagui';
import { getRandomString } from '~/src/utils/utilFuncs';
import NotificationCard from './NotificationCard';
import NoResultFound from '../../reusable/NoResultFound';
import labels from '~/src/constants/labels';

const Notifications = () => {
  const { theme } = useAppTheme();
  const { userId } = useUserStates();
  const styles = getStyles(theme);
  const { userNotificationsAsync, data, loading } = useUserNotifications();
  const { markAllNotificationsAsReadAsync, loading: markAllLoading } =
    useMarkAllNotificationsAsRead();
  const notifications = data?.userNotifications?.notifications;

  useEffect(() => getUserNotifications(), [userId]);

  const getUserNotifications = () => {
    if (userId) {
      userNotificationsAsync({ variables: { userId } });
    }
  };
  const onMarkAllAsRead = () => {
    if (userId)
      markAllNotificationsAsReadAsync({
        variables: { userId },
        onSuccess: getUserNotifications,
      });
  };

  return (
    <View style={styles.notiCont}>
      {notifications && notifications?.length > 0 ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 10,
          }}>
          <Text style={{ color: theme.textDark, fontSize: 17, fontFamily: 'InterBold' }}>
            {labels.notifications}
            <Text style={{ color: theme.primary }}> ({notifications?.length})</Text>
          </Text>
          <Button
            style={styles.markReadBtn}
            borderColor={theme.primary}
            paddingHorizontal={15}
            paddingVertical={5}
            disabled={markAllLoading}
            color={markAllLoading ? theme.silver : '#fff'}
            backgroundColor={markAllLoading ? theme.border : theme.primary}
            onPress={onMarkAllAsRead}
            unstyled>
            {labels.markAllRead}
          </Button>
        </View>
      ) : (
        <></>
      )}
      {loading ? (
        <CustomContentLoader type={'list'} size={15} repeat={5} />
      ) : notifications && notifications?.length > 0 ? (
        <ScrollView>
          {notifications?.map((noti: TNotification, index: number) => {
            return (
              <NotificationCard
                key={getRandomString(8)}
                notification={noti}
                onMarkSuccess={() => getUserNotifications()}
              />
            );
          })}
        </ScrollView>
      ) : (
        <NoResultFound searchType={labels.notifications.toLowerCase()} />
      )}
    </View>
  );
};

export default Notifications;

const getStyles = (theme: any) =>
  StyleSheet.create({
    notiCont: {
      paddingHorizontal: 10,
      paddingVertical: 10,
      backgroundColor: theme.bg,
      height: '100%',
    },
    markReadBtn: {
      fontFamily: 'InterBold',
      fontSize: 13,
      borderBottomLeftRadius: 50,
      borderTopRightRadius: 50,
      borderTopLeftRadius: 50,
      borderBottomRightRadius: 50,
    },
  });
