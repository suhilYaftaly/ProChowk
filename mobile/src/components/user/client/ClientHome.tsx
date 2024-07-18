import { FlatList, Linking, ListRenderItem, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { useUserStates } from '~/src/redux/reduxStates';
import {
  useContractorsByLocation,
  useContractorsByText,
} from '~/src/graphql/operations/contractor';
import { IUser } from '~/src/graphql/operations/user';
import ContractorCard from '../contractor/ContractorCard';
import { IAddress, ILatLng } from '~/src/graphql/operations/address';
import { isFiltersChanged } from '~/src/utils/utilFuncs';
import { setContFilters, userLocationSuccess } from '~/src/redux/slices/userSlice';
import { useAppDispatch } from '~/src/utils/hooks/hooks';
import CustomContentLoader from '../../reusable/CustomContentLoader';
import labels from '~/src/constants/labels';
import { nearbyContsFilterConfigs as CC, defaultAddress } from '@config/configConst';
import NoResultFound from '../../reusable/NoResultFound';
import { INearbyContFilters } from '../drawer/ContrFilterDrawer';
import LocDeniedSec from '../../reusable/LocDeniedSec';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

export interface INearbyContFilterErrors {
  radius: string;
  address?: string;
}

const ClientHome = () => {
  const dispatch = useAppDispatch();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { userLocation, contFilters: userFilters, userId } = useUserStates();
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

  const setDefaultFilters = (userAddress: IAddress) => {
    dispatch(
      setContFilters({
        radius: CC.defaults?.radius,
        address: userAddress,
        latLng: { lat: userAddress?.lat, lng: userAddress?.lng },
      })
    );
  };

  const renderListItem: ListRenderItem<IUser> = ({ item }) => <ContractorCard user={item} />;

  useEffect(() => {
    if (
      userFilters &&
      userFilters?.latLng &&
      userFilters?.latLng?.lat &&
      userFilters?.latLng?.lng
    ) {
      if (userFilters?.searchText && userFilters?.searchText !== '') {
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
      <View style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: theme.bg }}>
        {contsLoading || locationLoading ? (
          <CustomContentLoader type="jobCard" size={18} repeat={6} gap={10} />
        ) : contsList && contsList?.length > 0 ? (
          <>
            {contsList && contsTotalCount && contsTotalCount > 0 && (
              <Text style={styles.contractorListLabel}>
                {userId ? labels.contractorsFound : labels.nearByContractor}
                <Text style={{ color: theme.primary }}> ({contsTotalCount})</Text>
              </Text>
            )}
            <FlatList
              data={contsList}
              renderItem={renderListItem}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          contsList &&
          contsList?.length === 0 &&
          locPermission === 'granted' && (
            <NoResultFound searchType={labels.contractor.toLowerCase()} />
          )
        )}
        <LocDeniedSec
          locPermission={locPermission}
          setLocPermission={setLocPermission}
          setDefaultFilters={setDefaultFilters}
          setLocationLoading={setLocationLoading}
          userLatLng={userLatLng}
        />
      </View>
    </>
  );
};

export default ClientHome;

const getStyles = (theme: any) =>
  StyleSheet.create({
    contractorListLabel: {
      fontFamily: 'InterBold',
      fontSize: 15,
      color: theme.textDark,
      marginBottom: 10,
    },
  });
