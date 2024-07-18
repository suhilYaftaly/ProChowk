import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import AddressSearch from '../signUp/AddressSearch';
import labels from '~/src/constants/labels';
import { AddressInput, IAddress, LatLngInput } from '~/src/graphql/operations/address';
import { Button, Input, YStack } from 'tamagui';
import Slider from '@react-native-community/slider';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { nearbyContsFilterConfigs as CC } from '@/config/configConst';
import { useAppDispatch } from '~/src/utils/hooks/hooks';
import { setContFilters } from '~/src/redux/slices/userSlice';
import { useUserStates } from '~/src/redux/reduxStates';
import { defaultAddress } from '@config/configConst';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

export interface INearbyContFilters {
  searchText?: string;
  radius: number;
  address?: IAddress;
  latLng?: LatLngInput;
}

const ContrFilterDrawer = (props: any) => {
  const dispatch = useAppDispatch();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { user, userLocation, contFilters } = useUserStates();
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
        setContFilters({
          ...contFilters,
          ...{
            radius: areaRadius,
            address: location,
            latLng: { lat: location?.lat, lng: location?.lng },
          },
        })
      );
      props.navigation.closeDrawer();
    }
  };

  const handleResetFilters = () => {
    setAreaRadius(CC.defaults.radius);
    setLocationAvail(true);
    if (user?.address) setLocation(user?.address);
    else if (userLocation?.data?.lat && userLocation?.data?.lng)
      setLocation({
        ...{ lat: userLocation?.data?.lat, lng: userLocation?.data?.lng },
        ...defaultAddress,
      });
  };

  useEffect(() => {
    if (contFilters && contFilters?.address && contFilters?.radius) {
      setAreaRadius(contFilters?.radius);
      setLocation(contFilters?.address);
    }
  }, [contFilters]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.white }}>
      <View style={styles.drawerHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome name="filter" size={20} color={theme.primary} style={{ paddingRight: 10 }} />
          <Text style={styles.headerLabel}>{labels.filters}</Text>
        </View>
        <Pressable onPress={() => handleResetFilters()}>
          <MaterialIcons name="refresh" size={25} color={theme.black} />
        </Pressable>
      </View>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 0, backgroundColor: theme.white }}>
        <View
          style={{
            padding: 15,
            borderBottomColor: theme.border,
            borderBottomWidth: 1,
          }}>
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
        <View
          style={{
            padding: 15,
            borderBottomColor: theme.border,
            borderBottomWidth: 1,
          }}>
          <YStack space={'$1.5'}>
            <Text style={{ fontFamily: 'InterBold', color: theme.textDark }}>
              {labels.area}
              <Text style={{ color: theme.primary }}>*</Text>
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
              <Text style={styles.inputText}>{labels.km}</Text>
            </View>
            {areaError && <Text style={{ color: theme.error }}>*{labels.areaRadiusErrorText}</Text>}
            <Slider
              step={1}
              value={areaRadius}
              onValueChange={(val: number) => {
                setAreaRadius(val);
                if (areaError) setAreaError(false);
              }}
              minimumValue={CC.minRadius}
              maximumValue={CC.maxRadius}
              minimumTrackTintColor={theme.primary}
              maximumTrackTintColor={theme.bg}
              thumbTintColor={theme.primary}
            />
          </YStack>
        </View>
      </DrawerContentScrollView>
      <View style={styles.drawerFooter}>
        <Button
          style={[styles.footerBtns, { backgroundColor: 'transparent', color: theme.textDark }]}
          height={'$3'}
          onPress={() => props.navigation.closeDrawer()}>
          {labels.cancel}
        </Button>
        <Button
          style={styles.footerBtns}
          height={'$3'}
          backgroundColor={!location || !areaRadius ? theme.silver : theme.primary}
          alignItems="center"
          onPress={() => handleApplyFilter()}
          disabled={!location || !areaRadius}
          iconAfter={<FontAwesome name="chevron-right" size={15} color="#fff" />}>
          {labels.apply}
        </Button>
      </View>
    </View>
  );
};

export default ContrFilterDrawer;

const getStyles = (theme: any) =>
  StyleSheet.create({
    drawerHeader: {
      flexDirection: 'row',
      padding: 15,
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomColor: theme.border,
      borderBottomWidth: 1,
    },
    headerLabel: {
      fontFamily: 'InterExtraBold',
      fontSize: 18,
      color: theme.textDark,
    },
    areaInputCont: {
      alignItems: 'center',
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 7,
      paddingRight: 10,
    },
    inputText: {
      color: theme.textDark,
      fontFamily: 'InterSemiBold',
      backgroundColor: 'transparent',
    },
    drawerFooter: {
      flexDirection: 'row',
      padding: 10,
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopColor: theme.border,
      borderTopWidth: 1,
    },
    footerBtns: {
      fontFamily: 'InterBold',
      fontSize: 15,
    },
  });
