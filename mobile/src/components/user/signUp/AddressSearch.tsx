import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Input, ScrollView, Separator, Spinner, YStack } from 'tamagui';
import colors from '~/src/constants/colors';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { getUserLocation, removeServerMetadata, removeTypename } from '~/src/utils/utilFuncs';
import {
  IAddress,
  IGeoAddress,
  ILatLng,
  useGeocode,
  useReverseGeocode,
} from '~/src/graphql/operations/address';
import * as Location from 'expo-location';
import FullScreenDialog from '../../reusable/FullScreenDialog';
import { useUserStates } from '~/src/redux/reduxStates';
import labels from '~/src/constants/labels';
import CustomContentLoader from '../../reusable/CustomContentLoader';
import LocationPermission from '../../reusable/LocationPermission';
import { userLocationSuccess } from '~/src/redux/slices/userSlice';
import { useAppDispatch } from '~/src/utils/hooks/hooks';
import NoResultFound from '../../reusable/NoResultFound';

type Props = {
  location: IAddress | undefined;
  setLocation: (loc: IAddress) => void;
  isError: boolean;
  errorText: string;
};

const AddressSearch = ({ location, setLocation, isError, errorText }: Props) => {
  const dispatch = useAppDispatch();
  const { userLocation, userId } = useUserStates();
  const { geocodeAsync, data, loading } = useGeocode();
  const { reverseGeocodeAsync, loading: rGeoLoading } = useReverseGeocode();
  const [locPermission, setLocPermission] = useState<Location.PermissionStatus | undefined>();
  const [isOpen, setIsOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [displayValue, setDisplayValue] = useState('');
  const [processLoading, setProcessLoading] = useState(false);

  const getUserCoords = (userLocationData?: ILatLng) => {
    const lat = userLocationData?.lat;
    const lng = userLocationData?.lng;
    return { lat, lng };
  };

  const setUserLocation = () => {
    const userCorrds = getUserCoords(userLocation?.data);
    if (userId && userCorrds && userCorrds?.lat && userCorrds?.lng) {
      reverseGeocodeAsync({
        variables: { lat: userCorrds?.lat, lng: userCorrds?.lng },
        onSuccess: (data) => {
          const cleanedAdr = removeServerMetadata(data);
          setLocation(getAddressFormat(cleanedAdr));
        },
      });
    } else {
      setProcessLoading(true);
      getUserLocation({
        onSuccess: (latLng) => {
          dispatch(userLocationSuccess(latLng));
        },
      });
    }
  };

  const onInputChange = (val: string) => {
    if (val?.trim().length > 2 && val.length > displayValue?.length) {
      geocodeAsync({
        vars: { value: val, lat: userLocation?.data?.lat, lng: userLocation?.data?.lng },
      });
    }
    setInputValue(val);
    setDisplayValue(val);
  };

  const getCurrentLocation = () => {
    if (locPermission !== 'granted') {
      setOpenDialog(true);
    } else {
      setUserLocation();
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
    if (userLocation?.data) {
      setUserLocation();
      setProcessLoading(false);
    }
  }, [userLocation]);

  return (
    <YStack space={'$1.5'}>
      <Text style={styles.labelText}>
        {labels.location}
        <Text style={{ color: colors.primary }}>*</Text>
      </Text>
      <FullScreenDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        triggerBtnCom={
          <Button
            unstyled
            style={styles.menuButton}
            borderColor={'$border'}
            borderWidth={1}
            borderRadius={7}
            iconAfter={
              <Pressable
                disabled={rGeoLoading || processLoading}
                style={{ paddingVertical: 5, paddingHorizontal: 10 }}
                onPress={() => getCurrentLocation()}>
                {rGeoLoading || processLoading ? (
                  <Spinner color={colors.primary} />
                ) : (
                  <MaterialIcons name="my-location" size={20} color="black" />
                )}
              </Pressable>
            }
            onPress={() => setIsOpen(true)}>
            {location?.displayName ? location?.displayName : labels.location}
          </Button>
        }
        dialogCom={
          <>
            <View style={styles.searchContainer}>
              <Pressable onPress={() => setIsOpen(false)} style={styles.addBtn}>
                <FontAwesome6 name="angle-left" size={20} color="black" />
              </Pressable>
              <Input
                size={'$3'}
                flex={1}
                borderWidth={0}
                style={styles.inputText}
                placeholder={labels.searchAddress}
                autoCorrect={false}
                value={inputValue}
                onChangeText={(e) => onInputChange(e)}
              />
            </View>
            <Separator />
            {loading ? (
              <CustomContentLoader type={'list'} size={15} repeat={5} />
            ) : data?.geocode && data?.geocode?.length > 0 ? (
              <ScrollView padding={0} style={styles.skillsCont}>
                {data?.geocode?.map((address: IAddress, index: number) => {
                  return (
                    <Pressable
                      key={index}
                      onPress={() => {
                        setLocation(getAddressFormat(address));
                        setIsOpen(false);
                      }}>
                      <View style={styles.itemCont}>
                        <Text>{address?.displayName}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            ) : (
              inputValue && <NoResultFound searchType={labels.location.toLowerCase()} />
            )}
          </>
        }
      />
      {!isError && <Text style={{ color: colors.error }}>*{errorText}</Text>}
      {locPermission && (
        <LocationPermission
          isOpen={openDialog}
          setIsOpen={setOpenDialog}
          locPermission={locPermission}
          setLocPermission={setLocPermission}
        />
      )}
    </YStack>
  );
};

export default AddressSearch;

const styles = StyleSheet.create({
  labelText: { fontFamily: 'InterBold' },
  menuButton: {
    justifyContent: 'space-between',
    fontFamily: 'InterSemiBold',
    fontSize: 15,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 4,
    paddingBottom: 4,
    alignItems: 'center',
    color: colors.textDark,
  },
  searchContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 7,
    marginTop: 30,
  },
  inputText: {
    color: colors.textDark,
    fontFamily: 'InterSemiBold',
    fontSize: 15,
    backgroundColor: 'transparent',
  },
  itemCont: {
    padding: 15,
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.border,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addBtn: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
  },
  skillsCont: {
    flex: 1,
    marginTop: 10,
  },
});

export const getAddressFormat = (adr: IAddress) => {
  return {
    displayName: adr.displayName,
    street: adr.street,
    city: adr.city,
    county: adr.county,
    state: adr.state,
    stateCode: adr.stateCode,
    postalCode: adr.postalCode,
    country: adr.country,
    countryCode: adr.countryCode,
    lat: adr.lat,
    lng: adr.lng,
    geometry: removeTypename(adr.geometry),
  } as IGeoAddress;
};
