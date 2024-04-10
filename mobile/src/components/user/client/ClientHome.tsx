import { FlatList, Linking, ListRenderItem, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import LocationPermission from '../../reusable/LocationPermission';
import * as Location from 'expo-location';
import { useUserStates } from '~/src/redux/reduxStates';
import {
  useContractorsByLocation,
  useContractorsByText,
} from '~/src/graphql/operations/contractor';
import { IUser } from '~/src/graphql/operations/user';
import { Button, Circle, Input, Separator, YStack } from 'tamagui';
import colors from '~/src/constants/colors';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import ContractorCard from '../contractor/ContractorCard';
import { ILatLng } from '~/src/graphql/operations/address';
import { getUserLocation } from '~/src/utils/utilFuncs';
import { userLocationSuccess } from '~/src/redux/slices/userSlice';
import { useAppDispatch } from '~/src/utils/hooks/hooks';
import CustomContentLoader from '../../reusable/CustomContentLoader';
import labels from '~/src/constants/labels';

export interface INearbyContFilterErrors {
  radius: string;
  address?: string;
}

const ClientHome = () => {
  const dispatch = useAppDispatch();
  const { userLocation, userFilters } = useUserStates();
  const [openDialog, setOpenDialog] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [page, setPage] = useState(1);
  const userLatLng = userLocation?.data;
  const pageSize = 20;
  const [locPermission, setLocPermission] = useState<Location.PermissionStatus | undefined>();
  const {
    contractorsByLocationAsync,
    data: cByLData,
    loading: cByLLoading,
  } = useContractorsByLocation();
  const { contractorsByTextAsync, data: cByTData, loading: cByTLoading } = useContractorsByText();

  const searchNearByContractors = (currentPage = page, latLng: ILatLng) => {
    if (latLng) {
      contractorsByLocationAsync({
        variables: {
          latLng,
          page: currentPage,
          pageSize,
          radius: userFilters?.radius,
        },
      });
    }
  };

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

  const renderListItem: ListRenderItem<IUser> = ({ item }) => <ContractorCard user={item} />;

  useEffect(() => {
    checkPer();
  }, []);

  useEffect(() => {
    if (locPermission === 'granted') {
      if (userLatLng) {
        searchNearByContractors(page, userLatLng);
      } else {
        setLocationLoading(true);
        getUserLocation({
          onSuccess: (latLng) => {
            setLocationLoading(false);
            dispatch(userLocationSuccess(latLng));
            searchNearByContractors(page, latLng);
          },
        });
      }
    } else if (locPermission === 'undetermined') {
      setOpenDialog(true);
    }
  }, [locPermission]);

  useEffect(() => {
    if (
      userFilters &&
      userFilters?.latLng &&
      userFilters?.latLng?.lat !== userLatLng?.lat &&
      userFilters?.latLng?.lng !== userLatLng?.lng
    ) {
      searchNearByContractors(page, userFilters?.latLng);
    }
  }, [userFilters]);

  useEffect(() => {
    if (openDialog) setLocationLoading(true);
    else setLocationLoading(false);
  }, [openDialog]);

  return (
    <>
      <View style={{ padding: 20, backgroundColor: colors.bg }}>
        {cByLLoading || locationLoading ? (
          <CustomContentLoader type="jobCard" size={18} repeat={6} gap={10} />
        ) : (
          cByLData?.contractorsByLocation?.users && (
            <>
              <FlatList
                data={cByLData?.contractorsByLocation?.users}
                renderItem={renderListItem}
                showsVerticalScrollIndicator={false}
              />
            </>
          )
        )}
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
        <LocationPermission
          isOpen={openDialog}
          setIsOpen={setOpenDialog}
          locPermission={locPermission}
          setLocPermission={setLocPermission}
        />
      </View>
    </>
  );
};

export default ClientHome;

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
  searchContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    backgroundColor: colors.white,
  },
  inputText: {
    color: colors.textDark,
    fontFamily: 'InterSemiBold',
    fontSize: 15,
    backgroundColor: 'transparent',
  },
});
