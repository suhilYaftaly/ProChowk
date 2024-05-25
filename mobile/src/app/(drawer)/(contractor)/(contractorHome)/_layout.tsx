import { View, Text } from 'react-native';
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import colors from '~/src/constants/colors';
import ProjectFilterDrawer from '~/src/components/user/drawer/ProjectFilterDrawer';
import SearchContractor from '~/src/components/user/contractor/SearchContractor';
import SearchProjects from '~/src/components/user/client/SearchProjects';

const searchProjectLayout = () => {
  return (
    <Drawer
      screenOptions={{
        drawerPosition: 'right',
        overlayColor: colors.secondary50,
      }}
      drawerContent={(props) => <ProjectFilterDrawer {...props} />}>
      <Drawer.Screen
        name="contractorHomePage"
        options={{
          swipeEnabled: false,
          header(props) {
            return <SearchProjects {...props} />;
          },
        }}
      />
    </Drawer>
  );
};

export default searchProjectLayout;
