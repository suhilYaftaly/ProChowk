import React from 'react';
import { Tabs } from 'expo-router';
import { AntDesign, FontAwesome, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '~/src/constants/colors';

const tabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.textDark,
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
      }}>
      <Tabs.Screen
        name="(contractor)"
        options={{
          title: 'Contractor',
          tabBarIcon: ({ color }) => <FontAwesome6 name="suitcase" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="rated"
        options={{
          title: 'Rated',
          tabBarIcon: ({ color }) => <AntDesign name="star" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="postJob"
        options={{
          title: 'Post Job',
          tabBarIcon: ({ color }) => <FontAwesome6 name="circle-plus" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="topSkill"
        options={{
          title: 'Top Skill',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="puzzle" size={24} color={color} />
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

export default tabsLayout;
