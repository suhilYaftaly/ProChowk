import { FlatList, Linking, ListRenderItem, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import LocationPermission from '../../reusable/LocationPermission';
import * as Location from 'expo-location';
import { useUserStates } from '~/src/redux/reduxStates';
import {
  useContractorsByLocation,
  useContractorsByText,
} from '~/src/graphql/operations/contractor';
import { IUser } from '~/src/graphql/operations/user';
import { Button, Circle, YStack } from 'tamagui';
import colors from '~/src/constants/colors';
import { FontAwesome6 } from '@expo/vector-icons';
import ContractorCard from '../contractor/ContractorCard';
import { IAddress, ILatLng } from '~/src/graphql/operations/address';
import { getUserLocation, isFiltersChanged } from '~/src/utils/utilFuncs';
import { setUserFilters, userLocationSuccess } from '~/src/redux/slices/userSlice';
import { useAppDispatch } from '~/src/utils/hooks/hooks';
import CustomContentLoader from '../../reusable/CustomContentLoader';
import labels from '~/src/constants/labels';
import { nearbyContsFilterConfigs as CC, defaultAddress } from '@config/configConst';
import NoResultFound from '../../reusable/NoResultFound';
import { INearbyContFilters } from '../drawer/FilterDrawerContent';

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
  const [contsList, setContsList] = useState<IUser[]>([]);
  const [prevFilters, setPrevFilters] = useState<INearbyContFilters>(CC?.defaults);
  const userLatLng = userLocation?.data;
  const pageSize = 20;
  const [locPermission, setLocPermission] = useState<Location.PermissionStatus | undefined>();
  const {
    contractorsByLocationAsync,
    data: cByLData,
    loading: cByLLoading,
  } = useContractorsByLocation();
  const { contractorsByTextAsync, data: cByTData, loading: cByTLoading } = useContractorsByText();
  const contsLoading = cByLLoading || cByTLoading;
  const contsTotalCount = contsList?.length;
  const totalPages = contsTotalCount ? Math.ceil(contsTotalCount / pageSize) : 0;

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

  const searchNearByContractorByText = (
    currentPage = page,
    latLng: ILatLng,
    searchText: string
  ) => {
    contractorsByTextAsync({
      variables: {
        input: searchText,
        latLng: latLng,
        radius: userFilters?.radius ? userFilters?.radius : CC.defaults?.radius,
        page: 1,
        pageSize: 20,
      },
    });
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

  const setDefaultFilters = (userAddress: IAddress) => {
    dispatch(
      setUserFilters({
        radius: CC.defaults?.radius,
        address: userAddress,
        latLng: { lat: userAddress?.lat, lng: userAddress?.lng },
      })
    );
  };

  const renderListItem: ListRenderItem<IUser> = ({ item }) => <ContractorCard user={item} />;

  useEffect(() => {
    checkPer();
  }, []);

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

  useEffect(() => {
    if (
      userFilters &&
      userFilters?.latLng &&
      userFilters?.latLng?.lat &&
      userFilters?.latLng?.lng
    ) {
      if (userFilters?.searchText) {
        searchNearByContractorByText(page, userFilters?.latLng, userFilters?.searchText);
      } else if (isFiltersChanged(userFilters, prevFilters)) {
        searchNearByContractors(page, userFilters?.latLng);
      } else if (cByLData) setContsList(cByLData?.contractorsByLocation?.users);
      setPrevFilters(userFilters);
    }
  }, [userFilters]);

  useEffect(() => {
    if (openDialog) setLocationLoading(true);
    else setLocationLoading(false);
  }, [openDialog]);

  useEffect(() => {
    if (cByLData) setContsList(cByLData?.contractorsByLocation?.users);
  }, [cByLData]);

  useEffect(() => {
    if (cByTData) setContsList(cByTData?.contractorsByText?.users);
  }, [cByTData]);

  return (
    <>
      <View style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: colors.bg }}>
        {contsLoading || locationLoading ? (
          <CustomContentLoader type="jobCard" size={18} repeat={6} gap={10} />
        ) : contsList && contsList?.length > 0 ? (
          <>
            {contsList && contsTotalCount && contsTotalCount > 0 && (
              <Text style={styles.contractorListLabel}>
                {labels.contractorsFound}
                <Text style={{ color: colors.primary }}> ({contsTotalCount})</Text>
              </Text>
            )}
            <FlatList
              data={contsList}
              renderItem={renderListItem}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : contsList && contsList?.length === 0 ? (
          <NoResultFound searchType={labels.contractor.toLowerCase()} />
        ) : (
          <></>
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
        {openDialog && (
          <LocationPermission
            isOpen={openDialog}
            setIsOpen={setOpenDialog}
            locPermission={locPermission}
            setLocPermission={setLocPermission}
          />
        )}
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
  contractorListLabel: {
    fontFamily: 'InterBold',
    fontSize: 15,
    color: colors.textDark,
    marginBottom: 10,
  },
});
