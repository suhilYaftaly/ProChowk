import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome, FontAwesome6, Fontisto, Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
import { StyleSheet, Text, View } from 'react-native';
import { useUserStates } from '~/src/redux/reduxStates';
import { useUserNotifications } from '~/src/graphql/operations/notification';
import { Circle } from 'tamagui';

const contractorLayout = () => {
  const { theme } = useAppTheme();
  const { userId } = useUserStates();
  const { userNotificationsAsync, data } = useUserNotifications();
  const notifications = data?.userNotifications?.notifications;
  const count = notifications?.filter((notification) => !notification.read).length;

  useEffect(() => getUserNotifications(), [userId]);
  const getUserNotifications = () => {
    if (userId) {
      userNotificationsAsync({ variables: { userId } });
    }
  };
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: theme.white, display: userId ? 'flex' : 'none' },
        tabBarActiveTintColor: theme.textDark,
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
      }}>
      <Tabs.Screen
        name="(contractorHome)"
        options={{
          title: 'Projects',
          tabBarIcon: ({ color }) => <FontAwesome6 name="suitcase" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="message"
        options={{
          title: 'Message',
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-ellipses" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="postJob"
        initialParams={{ isOpen: true }}
        options={{
          title: 'Post Job',
          tabBarIcon: ({ color }) => <FontAwesome6 name="circle-plus" size={28} color={color} />,
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => (
            <View>
              <Fontisto name="bell-alt" size={26} color={color} />
              {count && count > 0 ? (
                <Circle backgroundColor={theme.primary} style={styles.badge} size={20}>
                  <Text style={{ color: '#fff' }}>{count}</Text>
                </Circle>
              ) : (
                <></>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorite',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="heart" color={color} />,
        }}
      />
    </Tabs>
  );
};

export default contractorLayout;

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
  },
});
