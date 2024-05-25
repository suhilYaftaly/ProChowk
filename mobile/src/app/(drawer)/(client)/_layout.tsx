import React from 'react';
import { Tabs } from 'expo-router';
import {
  AntDesign,
  FontAwesome,
  FontAwesome6,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import colors from '~/src/constants/colors';

const clientLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.textDark,
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
      }}>
      <Tabs.Screen
        name="(clientHome)"
        options={{
          title: 'Contractor',
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
          tabBarIcon: ({ color }) => <Fontisto name="bell-alt" size={26} color={color} />,
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

export default clientLayout;
