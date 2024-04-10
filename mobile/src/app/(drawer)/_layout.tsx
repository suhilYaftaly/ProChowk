import React from 'react';
import { Drawer } from 'expo-router/drawer';
import colors from '~/src/constants/colors';
import AppHeader from '~/src/components/header/AppHeader';
import AppDrawerContent from '~/src/components/user/drawer/AppDrawerContent';

const drawerLayout = () => {
  return (
    <Drawer
      screenOptions={{
        drawerPosition: 'right',
        overlayColor: colors.secondary50,
        header(props) {
          return <AppHeader {...props} />;
        },
        drawerHideStatusBarOnOpen: true,
        swipeEnabled: false,
      }}
      drawerContent={(props) => <AppDrawerContent {...props} />}>
      <Drawer.Screen name="(tabs)" />
    </Drawer>
  );
};

export default drawerLayout;
