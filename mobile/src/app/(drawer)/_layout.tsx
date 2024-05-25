import React from 'react';
import { Drawer } from 'expo-router/drawer';
import colors from '~/src/constants/colors';
import AppHeader from '~/src/components/header/AppHeader';
import AppDrawerContent from '~/src/components/user/drawer/AppDrawerContent';

const drawerLayout = () => {
  return (
    <Drawer
      backBehavior="none"
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
      <Drawer.Screen name="(client)" />
      <Drawer.Screen name="(contractor)" />
    </Drawer>
  );
};

export default React.memo(drawerLayout);
