import { Linking, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Circle, YStack } from 'tamagui';
import { FontAwesome6 } from '@expo/vector-icons';
import labels from '~/src/constants/labels';
import colors from '~/src/constants/colors';
import LocationPermission from './LocationPermission';
import * as Location from 'expo-location';
import { getUserLocation } from '~/src/utils/utilFuncs';
import { defaultAddress } from '~/src/config/configConst';
import { IAddress, ILatLng } from '~/src/graphql/operations/address';
import { userLocationSuccess } from '~/src/redux/slices/userSlice';
import { useAppDispatch } from '~/src/utils/hooks/hooks';

type Props = {
  locPermission?: Location.PermissionStatus;
  setLocPermission: (status: Location.PermissionStatus | undefined) => void;
  userLatLng?: ILatLng;
  setLocationLoading: (val: boolean) => void;
  setDefaultFilters: (userAdd: IAddress) => void;
};

const LocDeniedSec = ({
  userLatLng,
  setLocationLoading,
  setDefaultFilters,
  locPermission,
  setLocPermission,
}: Props) => {
  const dispatch = useAppDispatch();
  const [openDialog, setOpenDialog] = useState(false);

  const enableLocation = async () => {
    if (locPermission && locPermission === 'denied') {
      Linking.openSettings();
    } else if (locPermission && locPermission === 'undetermined') {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setLocPermission(status);
    }
  };

  const checkPer = async () => {
    let { status } = await Location.getForegroundPermissionsAsync();
    setLocPermission(status);
  };

  useEffect(() => {
    checkPer();
  }, []);

  useEffect(() => {
    if (openDialog) setLocationLoading(true);
    else setLocationLoading(false);
  }, [openDialog]);

  useEffect(() => {
    if (locPermission === 'granted') {
      if (userLatLng) {
        setDefaultFilters({ ...userLatLng, ...defaultAddress });
      } else {
        setLocationLoading(true);
        getUserLocation({
          onSuccess: (latLng) => {
            setLocationLoading(false);
            dispatch(userLocationSuccess(latLng));
            setDefaultFilters({ ...latLng, ...defaultAddress });
          },
        });
      }
    } else if (locPermission === 'undetermined') {
      setOpenDialog(true);
    }
  }, [locPermission]);

  return (
    <>
      {locPermission !== 'granted' && (
        <View style={styles.locationCont}>
          <Circle backgroundColor={colors.primary} size={50}>
            <FontAwesome6 name="location-dot" size={26} color={colors.white} />
          </Circle>
          <Text style={styles.headerText}>We noticed you've denied location access.</Text>
          <YStack>
            <Text style={styles.subHeaderText}>
              While you can still use our app, enabling location helps us:
            </Text>
            <Text style={styles.normalText}>- Customize content and services for you</Text>
            <Text style={styles.normalText}>- Provide location-specific recommendations</Text>
            <Text style={styles.normalText}>- Enhance user experience</Text>
            <Text style={styles.subHeaderText}>
              To enable location services later, you can do so from the phone settings.
              <Text style={{ color: colors.primary }}> Learn More</Text>
            </Text>
            <Text style={styles.normalText}>
              Your privacy matters to us. Your location data is secure and will never be shared
              without your consent.
            </Text>
            <Text style={styles.normalText}>Enable your location to see tailored results!</Text>
          </YStack>
          <Button
            style={styles.button}
            backgroundColor={colors.primary}
            onPress={() => enableLocation()}>
            {labels.enableLocation}
          </Button>
        </View>
      )}
      {openDialog && (
        <LocationPermission
          isOpen={openDialog}
          setIsOpen={setOpenDialog}
          locPermission={locPermission}
          setLocPermission={setLocPermission}
        />
      )}
    </>
  );
};

export default LocDeniedSec;

const styles = StyleSheet.create({
  locationCont: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  headerText: {
    fontFamily: 'InterExtraBold',
    fontSize: 18,
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 25,
    marginBottom: 10,
    marginTop: 10,
  },
  subHeaderText: {
    fontSize: 15,
    fontFamily: 'InterExtraBold',
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 25,
    marginTop: 15,
  },
  normalText: {
    fontSize: 15,
    fontFamily: 'InterMedium',
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 25,
  },
  button: {
    fontFamily: 'InterBold',
    fontSize: 15,
    borderBottomLeftRadius: 50,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    borderBottomRightRadius: 50,
    marginTop: 20,
    marginBottom: 10,
    justifyContent: 'center',
    color: colors.white,
    width: '90%',
  },
});
