import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { IJob, useDeleteJob, useJobsByLocation } from '~/src/graphql/operations/job';
import { Link, router } from 'expo-router';
import { Circle, Separator, Spinner, XStack } from 'tamagui';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { formatRelativeTime } from '~/src/utils/utilFuncs';
import { SkillInput } from '~/src/graphql/operations/skill';
import Chip from '../../reusable/Chip';
import Toast from 'react-native-toast-message';
import labels from '~/src/constants/labels';
import { useUserStates } from '~/src/redux/reduxStates';
import { LatLngInput } from '~/src/graphql/operations/address';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';

type Props = {
  job: IJob;
  onClick?: () => void;
  allowDelete?: boolean;
  showDraftExpiry?: boolean;
};

const JobCard = ({ job, onClick, allowDelete, showDraftExpiry }: Props) => {
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { userLocation, projectFilters } = useUserStates();
  const { deleteJobAsync, loading } = useDeleteJob();
  const { jobsByLocationAsync, data: jByLData, loading: jByLLoading } = useJobsByLocation();
  const isHourly = job?.budget?.type === 'Hourly';
  const handleDeleteJob = () => {
    if (job?.userId && job?.id) {
      deleteJobAsync({
        userId: job?.userId,
        variables: { id: job?.id },
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: `${labels.jobDeleted}`,
            position: 'top',
          });
        },
      });
    }
  };
  const updateSearchedJobs = () => {
    const latLng: LatLngInput = {
      lat: userLocation?.data?.lat!,
      lng: userLocation?.data?.lng!,
    };
    if (latLng) {
      jobsByLocationAsync({
        variables: {
          latLng,
          page: 1,
          pageSize: 20,
          radius: projectFilters?.radius,
        },
      });
    }
  };
  return (
    <View style={styles.contractorCardCont}>
      <Pressable
        style={styles.infoCont}
        onPress={onClick ? () => onClick() : () => router.navigate(`/job/${job?.id}`)}>
        <XStack jc={'space-between'} alignItems="center">
          <View style={styles.userNameCont}>
            <Text style={styles.userName}>{job?.title}</Text>
          </View>
          <View style={styles.actionCont}>
            <View style={styles.timeCont}>
              <FontAwesome6 name="clock" size={15} color={theme.textDark} />
              <Text style={{ fontSize: 13, marginLeft: 5, color: theme.textDark }}>
                {formatRelativeTime(job.createdAt)}
              </Text>
            </View>
            {allowDelete && (
              <Pressable onPress={() => handleDeleteJob()} style={{ marginLeft: 10 }}>
                <Circle size={30} borderColor={theme.border} borderWidth={1}>
                  {loading ? (
                    <Spinner />
                  ) : (
                    <MaterialIcons name="delete" size={20} color={theme.textDark} />
                  )}
                </Circle>
              </Pressable>
            )}
          </View>
        </XStack>
        <Text style={{ color: theme.textDark }}>
          {job?.budget?.type}:{' '}
          <Text style={{ color: theme.primary }}>
            {isHourly && `$${job?.budget?.from}-`}${job?.budget?.to}
          </Text>
          {isHourly && (
            <Text>
              {' '}
              | {labels.maxHours}:{' '}
              <Text style={{ color: theme.primary }}>{job?.budget?.maxHours}hr</Text>
            </Text>
          )}
        </Text>
        {job?.desc && (
          <Text style={styles.bioCont} numberOfLines={2} ellipsizeMode="tail">
            {job?.desc?.trim()}
          </Text>
        )}
        <View style={styles.chipsCont}>
          {job?.skills?.map((skill: SkillInput, index: number) => {
            return <Chip key={index} label={skill?.label} isDisplay={true} />;
          })}
        </View>
      </Pressable>
      <Separator borderColor={theme.border} />
      <View style={styles.footerCont}>
        <XStack alignItems="center" space={'$2'}>
          <Circle backgroundColor={theme.bg} borderColor={theme.border} borderWidth={1} size={30}>
            <FontAwesome6 name="location-dot" size={15} color={theme.silver} />
          </Circle>
          <Text style={styles.cityName}>{job?.address?.city}</Text>
        </XStack>
        {showDraftExpiry && job?.draftExpiry && (
          <View style={styles.expiryDateCont}>
            <Text
              style={
                styles.expiryDateText
              }>{`Will Expire in  ${formatRelativeTime(job?.draftExpiry, 'until')}`}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default JobCard;

const getStyles = (theme: any) =>
  StyleSheet.create({
    chipsCont: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingVertical: 5,
    },
    contractorCardCont: {
      backgroundColor: theme.white,
      borderColor: theme.border,
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 10,
    },
    timeCont: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.white,
      borderColor: theme.border,
      borderRadius: 20,
      borderWidth: 1,
      paddingHorizontal: 5,
      paddingVertical: 2,
    },
    actionCont: {
      flexDirection: 'row',
    },
    infoCont: {
      paddingHorizontal: 15,
      paddingVertical: 10,
    },
    userNameCont: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    userName: {
      fontFamily: 'InterBold',
      fontSize: 15,
      alignItems: 'center',
      width: 175,
      flexWrap: 'wrap',
      color: theme.textDark,
    },
    bioCont: {
      fontFamily: 'InterMedium',
      fontSize: 13,
      color: theme.textDark,
      marginTop: 5,
      marginRight: 5,
    },
    footerCont: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 15,
      paddingVertical: 10,
    },
    cityName: {
      fontFamily: 'InterBold',
      fontSize: 15,
      color: theme.textDark,
    },
    expiryDateCont: {
      backgroundColor: theme.primary20,
      borderColor: theme.primary,
      borderWidth: 1,
      paddingVertical: 3,
      paddingHorizontal: 10,
      borderRadius: 50,
    },
    expiryDateText: {
      fontFamily: 'InterBold',
      fontSize: 15,
      color: theme.primary,
    },
  });
