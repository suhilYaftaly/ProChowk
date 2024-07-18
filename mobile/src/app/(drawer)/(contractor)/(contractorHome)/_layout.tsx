import React from 'react';
import { Drawer } from 'expo-router/drawer';
import ProjectFilterDrawer from '~/src/components/user/drawer/ProjectFilterDrawer';
import SearchProjects from '~/src/components/user/client/SearchProjects';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

const searchProjectLayout = () => {
  const { theme } = useAppTheme();
  return (
    <Drawer
      screenOptions={{
        drawerPosition: 'right',
        overlayColor: theme.secondary50,
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
