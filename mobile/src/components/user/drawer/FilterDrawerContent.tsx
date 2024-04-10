import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import colors from '~/src/constants/colors';
import AddressSearch from '../signUp/AddressSearch';
import labels from '~/src/constants/labels';
import { AddressInput, IAddress, LatLngInput } from '~/src/graphql/operations/address';
import { Button, Input, YStack } from 'tamagui';
import Slider from '@react-native-community/slider';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { nearbyContsFilterConfigs as CC } from '@/config/configConst';
import { useAppDispatch } from '~/src/utils/hooks/hooks';
import { setUserFilters } from '~/src/redux/slices/userSlice';
import { useUserStates } from '~/src/redux/reduxStates';

export interface INearbyContFilters {
  radius: number;
  address?: IAddress;
  latLng?: LatLngInput;
}

const FilterDrawerContent = (props: any) => {
  const dispatch = useAppDispatch();
  const { user } = useUserStates();
  const [location, setLocation] = useState<AddressInput>();
  const [locationAvail, setLocationAvail] = useState<boolean>(true);
  const [areaRadius, setAreaRadius] = useState<number>(CC.defaults.radius);
  const [areaError, setAreaError] = useState(false);

  const handleAreaChange = (val: string) => {
    const aRadius = Number(val);
    if (aRadius >= CC.minRadius && aRadius <= CC.maxRadius) {
      setAreaRadius(aRadius);
      setAreaError(false);
    } else {
      setAreaRadius(aRadius);
      setAreaError(true);
    }
  };

  const handleApplyFilter = () => {
    if (location && areaRadius) {
      dispatch(
        setUserFilters({
          radius: areaRadius,
          address: location,
          latLng: { lat: location?.lat, lng: location?.lng },
        })
      );
      props.navigation.closeDrawer();
    }
  };
  const handleResetFilters = () => {
    setAreaRadius(CC.defaults.radius);
    setLocationAvail(true);
    setLocation(user?.address);
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.drawerHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome
            name="filter"
            size={20}
            color={colors.primary}
            style={{ paddingRight: 10 }}
          />
          <Text style={styles.headerLabel}>{labels.filters}</Text>
        </View>
        <Pressable onPress={() => handleResetFilters()}>
          <MaterialIcons name="refresh" size={25} color="black" />
        </Pressable>
      </View>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        <View style={{ padding: 15, borderBottomColor: colors.border, borderBottomWidth: 1 }}>
          <AddressSearch
            location={location}
            setLocation={(loc: IAddress) => {
              setLocation(loc);
              setLocationAvail(true);
            }}
            isError={locationAvail}
            errorText={labels.addressError}
          />
        </View>
        <View style={{ padding: 15, borderBottomColor: colors.border, borderBottomWidth: 1 }}>
          <YStack space={'$1.5'}>
            <Text style={{ fontFamily: 'InterBold' }}>
              {labels.area}
              <Text style={{ color: colors.primary }}>*</Text>
            </Text>
            <View style={styles.areaInputCont}>
              <Input
                size={'$3'}
                flex={1}
                inputMode="numeric"
                style={styles.inputText}
                borderWidth={0}
                value={areaRadius?.toString()}
                onChangeText={(e) => handleAreaChange(e)}
                textAlign="right"
              />
              <Text style={styles.inputText}>Km</Text>
            </View>
            {areaError && (
              <Text style={{ color: colors.error }}>*{labels.areaRadiusErrorText}</Text>
            )}
            <Slider
              step={1}
              value={areaRadius}
              onValueChange={(val: number) => {
                setAreaRadius(val);
                if (areaError) setAreaError(false);
              }}
              minimumValue={CC.minRadius}
              maximumValue={CC.maxRadius}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.bg}
              thumbTintColor={colors.primary}
            />
          </YStack>
        </View>
      </DrawerContentScrollView>
      <View style={styles.drawerFooter}>
        <Button
          style={[styles.footerBtns, { backgroundColor: 'transparent', color: colors.textDark }]}
          height={'$3'}
          onPress={() => props.navigation.closeDrawer()}>
          {labels.cancel}
        </Button>
        <Button
          style={styles.footerBtns}
          height={'$3'}
          backgroundColor={!location || !areaRadius ? colors.silver : colors.primary}
          alignItems="center"
          onPress={() => handleApplyFilter()}
          disabled={!location || !areaRadius}
          iconAfter={<FontAwesome name="chevron-right" size={15} color={colors.white} />}>
          {labels.apply}
        </Button>
      </View>
    </View>
  );
};

export default FilterDrawerContent;

const styles = StyleSheet.create({
  drawerHeader: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  },
  headerLabel: {
    fontFamily: 'InterExtraBold',
    fontSize: 18,
    color: colors.textDark,
  },
  areaInputCont: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 7,
    paddingRight: 10,
  },
  inputText: {
    color: colors.textDark,
    fontFamily: 'InterSemiBold',
    backgroundColor: 'transparent',
  },
  drawerFooter: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: colors.border,
    borderTopWidth: 1,
  },
  footerBtns: {
    fontFamily: 'InterBold',
    fontSize: 15,
  },
});
