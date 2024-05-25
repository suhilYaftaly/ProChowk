import { Drawer } from 'expo-router/drawer';
import colors from '~/src/constants/colors';
import ContrFilterDrawer from '~/src/components/user/drawer/ContrFilterDrawer';
import SearchContractor from '~/src/components/user/contractor/SearchContractor';

const searchContrLayout = () => {
  return (
    <Drawer
      screenOptions={{
        drawerPosition: 'right',
        overlayColor: colors.secondary50,
      }}
      drawerContent={(props) => <ContrFilterDrawer {...props} />}>
      <Drawer.Screen
        name="clientHomePage"
        options={{
          swipeEnabled: false,
          header(props) {
            return <SearchContractor {...props} />;
          },
        }}
      />
    </Drawer>
  );
};

export default searchContrLayout;
