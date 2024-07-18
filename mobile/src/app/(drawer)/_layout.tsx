import React from 'react';
import { Drawer } from 'expo-router/drawer';
import AppHeader from '~/src/components/header/AppHeader';
import AppDrawerContent from '~/src/components/user/drawer/AppDrawerContent';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

const drawerLayout = () => {
  const { theme } = useAppTheme();
  return (
    <Drawer
      backBehavior="none"
      screenOptions={{
        drawerPosition: 'right',
        overlayColor: theme.secondary50,
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
