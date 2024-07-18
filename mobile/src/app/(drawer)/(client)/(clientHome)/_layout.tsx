import { Drawer } from 'expo-router/drawer';
import ContrFilterDrawer from '~/src/components/user/drawer/ContrFilterDrawer';
import SearchContractor from '~/src/components/user/contractor/SearchContractor';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
import { useUserStates } from '~/src/redux/reduxStates';
import LandingPage from '~/src/components/user/contractor/LandingPage';

const searchContrLayout = () => {
  const { theme } = useAppTheme();
  const { userId } = useUserStates();
  return (
    <Drawer
      screenOptions={{
        drawerPosition: 'right',
        overlayColor: theme.secondary50,
      }}
      drawerContent={(props) => <ContrFilterDrawer {...props} />}>
      <Drawer.Screen
        name="clientHomePage"
        options={{
          swipeEnabled: false,
          header(props) {
            return userId ? <SearchContractor {...props} /> : <LandingPage {...props} />;
          },
        }}
      />
    </Drawer>
  );
};

export default searchContrLayout;
