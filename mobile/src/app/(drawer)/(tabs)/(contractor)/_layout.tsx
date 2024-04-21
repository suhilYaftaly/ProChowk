import { Drawer } from 'expo-router/drawer';
import colors from '~/src/constants/colors';
import FilterDrawerContent from '~/src/components/user/drawer/FilterDrawerContent';
import SearchContractor from '~/src/components/user/contractor/SearchContractor';

const contractorLayout = () => {
  return (
    <Drawer
      screenOptions={{
        drawerPosition: 'right',
        overlayColor: colors.secondary50,
      }}
      drawerContent={(props) => <FilterDrawerContent {...props} />}>
      <Drawer.Screen
        name="index"
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

export default contractorLayout;
