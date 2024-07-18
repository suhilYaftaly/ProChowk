import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { TNotification, useMarkNotificationAsRead } from '~/src/graphql/operations/notification';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
import { Circle, Spinner, XStack, YStack } from 'tamagui';
import { formatRelativeTime, getRandomString } from '~/src/utils/utilFuncs';
import { router } from 'expo-router';
import Routes from '~/src/routes/Routes';
import { BidJob } from '../../reusable/CustomIcons';
import { FontAwesome6, Fontisto, Ionicons } from '@expo/vector-icons';
import { useUserStates } from '~/src/redux/reduxStates';
type Props = {
  notification: TNotification;
  onMarkSuccess: () => void;
};
const NotificationCard = ({ notification, onMarkSuccess }: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { userId } = useUserStates();
  const { markNotificationAsReadAsync, loading: notiReadLoading } = useMarkNotificationAsRead();
  const { id, title, message, read, type, data, createdAt } = notification;

  const onMarkAsRead = (notificationId: string) => {
    if (!read) {
      markNotificationAsReadAsync({
        variables: { notificationId },
        onSuccess: onMarkSuccess,
      });
    }
  };

  const markAndNavigateToJob = () => {
    onMarkAsRead(id);
    if (data?.jobId) router.navigate(`/job/${data?.id}`);
  };
  const navigateToUserPage = () => {
    if (userId) router.navigate(`/user/${userId}`);
  };

  const getNotificationItemProps = () => {
    switch (type) {
      case 'BidPlaced':
        return {
          icons: <BidJob size={30} color={theme.textDark} />,
          onPress: markAndNavigateToJob,
        };
      case 'BidAccepted':
        return {
          icons: <BidJob size={30} color={theme.textDark} />,
          onPress: markAndNavigateToJob,
        };
      case 'BidRejected':
        return {
          icons: <BidJob size={30} color={theme.textDark} />,
          onPress: markAndNavigateToJob,
        };
      case 'BidCompleted':
        return {
          icons: <FontAwesome6 name="suitcase" size={24} color={theme.textDark} />,
          onPress: markAndNavigateToJob,
        };
      case 'JobFinished':
        return {
          icons: <FontAwesome6 name="suitcase" size={24} color={theme.textDark} />,
          onPress: markAndNavigateToJob,
        };
      case 'ReviewReceived':
        return {
          icons: <Ionicons name="chatbubble-ellipses" size={26} color={theme.textDark} />,
          onPress: () => {
            onMarkAsRead(id);
            navigateToUserPage();
          },
        };
      default:
        return {
          icons: <Fontisto name="bell-alt" size={25} color={theme.textDark} />,
          onPress: () => onMarkAsRead(id),
        };
    }
  };

  const itemProps = getNotificationItemProps();
  return (
    <Pressable onPress={itemProps?.onPress}>
      <View style={styles.notificationBox}>
        <View style={styles.notiIcon}>{notiReadLoading ? <Spinner /> : itemProps?.icons}</View>
        <XStack jc={'space-between'} alignItems="center">
          <View style={styles.notiDetails}>
            <Text style={{ color: theme.textDark, fontFamily: 'InterBold', fontSize: 16 }}>
              {title}
            </Text>
            {message && (
              <Text style={{ color: theme.textDark, fontFamily: 'InterSemiBold', fontSize: 14 }}>
                {message}
              </Text>
            )}
          </View>
          <View style={styles.timeStampCont}>
            {createdAt && (
              <Text style={{ fontSize: 13, marginLeft: 5, color: theme.textDark }}>
                {formatRelativeTime(new Date(createdAt)?.toISOString())} ago
              </Text>
            )}
            {!read && <Circle backgroundColor={theme.primary} size={10} marginLeft={10} />}
          </View>
        </XStack>
      </View>
    </Pressable>
  );
};

export default NotificationCard;

const getStyles = (theme: any) =>
  StyleSheet.create({
    notificationBox: {
      width: '100%',
      flexDirection: 'row',
      backgroundColor: theme.white,
      padding: 10,
      borderRadius: 10,
      alignItems: 'center',
      marginVertical: 5,
    },
    notiIcon: {
      width: '12%',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 5,
    },
    notiDetails: {
      width: '68%',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    timeStampCont: { flexDirection: 'column', alignItems: 'center', rowGap: 5, width: '20%' },
  });
