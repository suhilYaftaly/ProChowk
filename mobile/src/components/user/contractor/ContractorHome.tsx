import { ListRenderItem, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { useAppDispatch } from '~/src/utils/hooks/hooks';
import { useUserStates } from '~/src/redux/reduxStates';
import { IAddress, ILatLng, LatLngInput } from '~/src/graphql/operations/address';
import { BudgetType, IJob, useJobsByLocation, useJobsByText } from '~/src/graphql/operations/job';
import { searchNearbyJobsFilterConfigs as FCC } from '@config/configConst';
import { setProjectsFilters } from '~/src/redux/slices/userSlice';
import JobCard from '../client/JobCard';
import { isProjectFiltersChanged } from '~/src/utils/utilFuncs';
import LocDeniedSec from '../../reusable/LocDeniedSec';
import NoResultFound from '../../reusable/NoResultFound';
import labels from '~/src/constants/labels';
import CustomContentLoader from '../../reusable/CustomContentLoader';
import { FlatList } from 'react-native-gesture-handler';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

export interface INearByJobFilters {
  searchText?: string;
  radius: number;
  address?: IAddress;
  latLng?: LatLngInput;
  startDate?: string;
  endDate?: string;
  budget: { types: BudgetType[]; from: string; to: string };
  seleProjectType: string;
  seleDayPosted: string;
}

const ContractorHome = () => {
  const dispatch = useAppDispatch();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { userLocation, projectFilters, userView } = useUserStates();
  const [locPermission, setLocPermission] = useState<Location.PermissionStatus | undefined>();
  const [locationLoading, setLocationLoading] = useState(false);
  const [savedView, setSavedView] = useState<string | null>();
  const [page, setPage] = useState(1);
  const [projectsList, setProjectsList] = useState<IJob[]>([]);
  const [prevFilters, setPrevFilters] = useState<INearByJobFilters>(FCC?.defaults);
  const userLatLng = userLocation?.data;
  const pageSize = 20;
  const { jobsByTextAsync, data: jByTData, loading: jByTLoading } = useJobsByText();
  const { jobsByLocationAsync, data: jByLData, loading: jByLLoading } = useJobsByLocation();
  const jobsData = jByTData?.jobsByText || jByLData?.jobsByLocation;
  const jobsTotalCount = projectsList?.length;
  const jobsLoading = jByTLoading || jByLLoading;
  const totalPages = jobsTotalCount ? Math.ceil(jobsTotalCount / pageSize) : 0;

  const searchNearByProjects = (currentPage = page, latLng: ILatLng) => {
    if (latLng) {
      jobsByLocationAsync({
        variables: {
          latLng,
          page: currentPage,
          pageSize,
          radius: projectFilters?.radius,
        },
      });
    }
  };

  const searchNearByProjectsByText = (currentPage = page, latLng: ILatLng, searchText: string) => {
    const fBudget = projectFilters?.budget;
    jobsByTextAsync({
      variables: {
        inputText: searchText,
        latLng: latLng,
        budget: {
          types: fBudget?.types ? fBudget?.types : FCC.defaults?.budget?.types,
          from: fBudget?.from ? Number(fBudget?.from) : Number(FCC.defaults.budget.from),
          to: fBudget?.to ? Number(fBudget?.to) : Number(FCC.defaults.budget.to),
        },
        startDate: projectFilters?.startDate,
        radius: projectFilters?.radius ? projectFilters?.radius : FCC.defaults?.radius,
        page: currentPage,
        pageSize: 20,
      },
    });
  };

  const setDefaultFilters = (userAddress: IAddress) => {
    dispatch(
      setProjectsFilters({
        ...FCC.defaults,
        ...{
          address: userAddress,
          latLng: { lat: userAddress?.lat, lng: userAddress?.lng },
        },
      })
    );
  };

  const renderListItem: ListRenderItem<IJob> = ({ item }) => <JobCard job={item} />;

  useEffect(() => {
    if (
      projectFilters &&
      projectFilters?.latLng &&
      projectFilters?.latLng?.lat &&
      projectFilters?.latLng?.lng
    ) {
      if (projectFilters?.searchText && projectFilters?.searchText !== '') {
        searchNearByProjectsByText(page, projectFilters?.latLng, projectFilters?.searchText);
      } else if (isProjectFiltersChanged(projectFilters, prevFilters)) {
        if (!jByLData) searchNearByProjects(page, projectFilters?.latLng);
        /*  else if (savedView === userView && jByLData)
          Toast.show({ type: 'warning', text1: 'Search text is empty' }); */
      } else if (jByLData) setProjectsList(jByLData?.jobsByLocation?.jobs);
      setPrevFilters(projectFilters);
      setSavedView(userView);
    }
  }, [projectFilters]);

  useEffect(() => {
    if (jByLData) setProjectsList(jByLData?.jobsByLocation?.jobs);
  }, [jByLData]);

  useEffect(() => {
    if (jByTData) setProjectsList(jByTData?.jobsByText?.jobs);
  }, [jByTData]);

  return (
    <View style={{ paddingHorizontal: 20, paddingVertical: 10, backgroundColor: theme.bg }}>
      {jobsLoading || locationLoading ? (
        <CustomContentLoader type="jobCard" size={18} repeat={6} gap={10} />
      ) : projectsList && projectsList?.length > 0 ? (
        <>
          {projectsList && jobsTotalCount && jobsTotalCount > 0 && (
            <Text style={styles.contractorListLabel}>
              {labels.jobsFound}
              <Text style={{ color: theme.primary }}> ({jobsTotalCount})</Text>
            </Text>
          )}
          <FlatList
            data={projectsList}
            renderItem={renderListItem}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        projectsList &&
        projectsList?.length === 0 &&
        locPermission === 'granted' && <NoResultFound searchType={labels.jobs.toLowerCase()} />
      )}
      <LocDeniedSec
        locPermission={locPermission}
        setLocPermission={setLocPermission}
        setDefaultFilters={setDefaultFilters}
        setLocationLoading={setLocationLoading}
        userLatLng={userLatLng}
      />
    </View>
  );
};

export default ContractorHome;

const getStyles = (theme: any) =>
  StyleSheet.create({
    contractorListLabel: {
      fontFamily: 'InterBold',
      fontSize: 15,
      color: theme.textDark,
      marginBottom: 10,
    },
  });
