import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AddressInput, IAddress, LatLngInput } from '~/src/graphql/operations/address';
import labels from '~/src/constants/labels';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Button, Input, YStack } from 'tamagui';
import Slider from '@react-native-community/slider';
import AddressSearch from '../signUp/AddressSearch';
import { searchNearbyJobsFilterConfigs as CC } from '@/config/configConst';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { defaultAddress } from '~/src/config/configConst';
import { setProjectsFilters } from '~/src/redux/slices/userSlice';
import { useUserStates } from '~/src/redux/reduxStates';
import { useAppDispatch } from '~/src/utils/hooks/hooks';
import DayPostedSele, { IDateRange } from './DayPostedSele';
import ProjectTypeSele from './ProjectTypeSele';
import PriceRangeSele from './PriceRangeSele';
import { BudgetType } from '~/src/graphql/operations/job';
import Toast from 'react-native-toast-message';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

export type TTypeOption = 'All' | 'Hourly' | 'Project';

const ProjectFilterDrawer = (props: any) => {
  const dispatch = useAppDispatch();
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { user, userLocation, projectFilters } = useUserStates();
  const [location, setLocation] = useState<AddressInput>();
  const [locationAvail, setLocationAvail] = useState<boolean>(true);
  const [areaRadius, setAreaRadius] = useState<number>(CC.defaults.radius);
  const [areaError, setAreaError] = useState(false);
  const [projectTypes, setProjectTypes] = useState<BudgetType[]>([]);
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [fromVal, setFromVal] = useState<string>(CC.defaults.budget.from?.toString());
  const [toVal, setToVal] = useState<string>(CC.defaults.budget.to?.toString());
  const [seleDayPosted, setSeleDayPosted] = useState<string>('24 Hr');
  const [seleProjectType, setSeleProjectType] = useState<string>('All');

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
    if (location && areaRadius && fromVal && toVal) {
      if (!projectFilters?.searchText) {
        Toast.show({ type: 'warning', text1: labels.searchTextEmpty });
      }
      dispatch(
        setProjectsFilters({
          ...projectFilters,
          ...{
            radius: areaRadius,
            address: location,
            latLng: { lat: location?.lat, lng: location?.lng },
            budget: { types: projectTypes, from: fromVal, to: toVal },
            startDate: startDate,
            endDate: endDate,
            seleDayPosted: seleDayPosted,
            seleProjectType: seleProjectType,
          },
        })
      );
      props.navigation.closeDrawer();
    }
  };

  const handleResetFilters = () => {
    setAreaRadius(CC.defaults.radius);
    setSeleProjectType(CC.defaults.seleProjectType);
    setProjectTypes(CC.defaults?.budget?.types);
    setSeleDayPosted(CC.defaults.seleDayPosted);
    setFromVal(CC.defaults.budget.from?.toString());
    setToVal(CC.defaults.budget.to?.toString());
    setLocationAvail(true);
    if (user?.address) setLocation(user?.address);
    else if (userLocation?.data?.lat && userLocation?.data?.lng)
      setLocation({
        ...{ lat: userLocation?.data?.lat, lng: userLocation?.data?.lng },
        ...defaultAddress,
      });
  };
  const handleProTypeChange = (val: string) => {
    setSeleProjectType(val);
    switch (val) {
      case 'All':
        setProjectTypes(['Hourly', 'Project']);
        break;
      case 'Hourly':
        setProjectTypes(['Hourly']);
        break;
      case 'Project':
        setProjectTypes(['Project']);
        break;
    }
  };
  const onDateChange = ({ startDate, endDate }: IDateRange) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const applySavedProperties = () => {
    if (
      projectFilters &&
      projectFilters?.address &&
      projectFilters?.radius &&
      projectFilters?.seleProjectType &&
      projectFilters?.seleDayPosted &&
      projectFilters?.budget?.from &&
      projectFilters?.budget?.to &&
      projectFilters?.budget?.types
    ) {
      setAreaRadius(projectFilters?.radius);
      setLocation(projectFilters?.address);
      setStartDate(projectFilters?.startDate);
      setEndDate(projectFilters?.endDate);
      setFromVal(projectFilters?.budget?.from?.toString());
      setToVal(projectFilters?.budget?.to?.toString());
      setProjectTypes(projectFilters?.budget?.types);
      setSeleProjectType(projectFilters?.seleProjectType);
      setSeleDayPosted(projectFilters?.seleDayPosted);
    }
  };

  useEffect(() => {
    applySavedProperties();
  }, [projectFilters]);

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
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        <View style={{ padding: 15, borderBottomColor: theme.border, borderBottomWidth: 1 }}>
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
        <View style={{ padding: 15, borderBottomColor: theme.border, borderBottomWidth: 1 }}>
          <YStack space={'$1.5'}>
            <Text style={{ fontFamily: 'InterBold', color: theme.textDark }}>
              {labels.radius}
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
        <View style={{ padding: 15, borderBottomColor: theme.border, borderBottomWidth: 1 }}>
          <PriceRangeSele
            fromVal={fromVal}
            toVal={toVal}
            setFromVal={setFromVal}
            setToVal={setToVal}
          />
        </View>
        <View style={{ padding: 15, borderBottomColor: theme.border, borderBottomWidth: 1 }}>
          <ProjectTypeSele
            seleProjectType={seleProjectType}
            handleProTypeChange={handleProTypeChange}
          />
        </View>
        <View style={{ padding: 15 }}>
          <DayPostedSele
            onDateChange={onDateChange}
            seleOption={seleDayPosted}
            setSeleOption={setSeleDayPosted}
          />
        </View>
      </DrawerContentScrollView>
      <View style={styles.drawerFooter}>
        <Button
          style={[styles.footerBtns, { backgroundColor: 'transparent', color: theme.textDark }]}
          height={'$3'}
          onPress={() => {
            applySavedProperties();
            props.navigation.closeDrawer();
          }}>
          {labels.cancel}
        </Button>
        <Button
          style={styles.footerBtns}
          height={'$3'}
          backgroundColor={!location || !areaRadius ? theme.silver : theme.primary}
          alignItems="center"
          onPress={() => handleApplyFilter()}
          disabled={!location || !areaRadius || Number(fromVal) < 10 || Number(toVal) > 50000}
          iconAfter={<FontAwesome name="chevron-right" size={15} color="#fff" />}>
          {labels.apply}
        </Button>
      </View>
    </View>
  );
};

export default ProjectFilterDrawer;

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
