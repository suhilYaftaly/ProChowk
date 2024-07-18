import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '~/src/utils/hooks/hooks';
import { useBidStates, useUserStates } from '~/src/redux/reduxStates';
import { useGetUserAvgReviews, useGetUserReviews } from '~/src/graphql/operations/review';
import { useUser } from '~/src/graphql/operations/user';
import { useJob } from '~/src/graphql/operations/job';
import { useGetBids } from '~/src/graphql/operations/jobBid';
import { Button, ScrollView } from 'tamagui';
import CustomContentLoader from '../reusable/CustomContentLoader';

import Chip from '../reusable/Chip';
import PostedBy from './jobPost/PostedBy';
import labels from '~/src/constants/labels';
import { useAppTheme } from '~/src/utils/hooks/ThemeContext';
import BidThisJob, { isAllowBid } from './bid/jobBidding/BidThisJob';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CompleteJobBtn from './completeJob/CompleteJobBtn';
import JobPreview from './jobPost/JobPreview';
import MiniBidsList from './bid/process/MiniBidsList';
import AcceptedBid from './bid/process/AcceptedBid';
import GiveReviewModal from './completeJob/GiveReviewModal';
import HiredModal from './bid/process/HiredModal';
import { setShowHiredModal } from '~/src/redux/slices/bidSlice';

type Props = {
  jobId?: string | string[];
};

const ViewJob = ({ jobId }: Props) => {
  const dispatch = useAppDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const { theme } = useAppTheme();
  const styles = getStyles(theme);
  const { user: loggedInUser } = useUserStates();
  const { showHiredModal } = useBidStates();
  const [openRating, setOpenRating] = useState(false);
  const { getUserReviewsAsync, data: reviewsData, loading: reviewLoading } = useGetUserReviews();
  const { userAsync, data: userData, loading: userLoading } = useUser();
  const { jobAsync, data: jobData, loading } = useJob();
  const userReviews = reviewsData?.getUserReviews;
  const job = jobData?.job;
  const isMyProfile = job?.userId === loggedInUser?.id;
  const jobPoster = isMyProfile ? loggedInUser : userData?.user;
  const { getBidsAsync, data: bidsData } = useGetBids();
  const bids = bidsData?.getBids;
  const openBids = bids?.filter((bid) => bid.status === 'Open');
  const acceptedBid = bids?.find((bid) => bid.status === 'Accepted' || bid.status === 'Completed');
  const isMyJob = job?.userId === loggedInUser?.id;
  const isJobReadyForCompletion =
    isMyJob && job?.status === 'InProgress' && acceptedBid?.status === 'Completed';
  const bidder = acceptedBid?.contractor?.user;
  const acceptedBidderUserId = bidder?.id;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (jobId && typeof jobId === 'string') {
      jobAsync({ variables: { id: jobId }, onSuccess: () => setRefreshing(false) });
    }
  }, []);

  //retriev user info
  useEffect(() => {
    if (job?.userId) {
      userAsync({ variables: { id: job.userId } });
      getUserReviewsAsync({ variables: { userId: job.userId } });
    }
  }, [job?.userId]);

  useEffect(() => {
    if (jobId && typeof jobId === 'string') jobAsync({ variables: { id: jobId } });
  }, [jobId]);

  //retrieve bids if its my profile
  useEffect(() => {
    if (isMyJob && job?.id) {
      getBidsAsync({ variables: { filter: { jobId: job.id } } });
    }
  }, [job, isMyJob]);

  //prevent self bidding & must be contractor
  const allowBid = isAllowBid({
    userTypes: loggedInUser?.userTypes,
    userId: loggedInUser?.id,
    jobUserId: job?.userId,
  });

  const isMiniBids: boolean =
    !acceptedBid && openBids && openBids?.length > 0 && isMyJob && jobPoster ? true : false;

  const actionBtn =
    job && isJobReadyForCompletion ? (
      <CompleteJobBtn jobId={job.id} onSuccess={() => setOpenRating(true)} />
    ) : allowBid && job ? (
      <BidThisJob job={job} jobPoster={jobPoster} />
    ) : isMiniBids && openBids && job && jobPoster ? (
      <MiniBidsList bids={openBids} job={job} jobPoster={jobPoster} />
    ) : (
      isMyJob &&
      acceptedBid &&
      job && <AcceptedBid bid={acceptedBid} job={job} jobPoster={jobPoster} />
    );

  const refreshJob = () => {
    if (jobId && typeof jobId === 'string') jobAsync({ variables: { id: jobId } });
  };

  return (
    <>
      <ScrollView
        style={{ backgroundColor: theme.bg }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        overScrollMode="always">
        {loading ? (
          <CustomContentLoader type="jobCard" size={20} repeat={1} />
        ) : (
          <View style={{ backgroundColor: theme.bg }}>
            {job && <JobPreview job={job} />}
            {job?.status && (
              <View style={styles.jobStatusCont}>
                <Text style={styles.boldText}>{labels.jobStatus}</Text>
                <Chip label={job?.status} isDisplay={true} />
              </View>
            )}
            {jobPoster && (
              <PostedBy
                user={jobPoster}
                loading={userLoading}
                title="Posted By"
                userReviewData={userReviews}
              />
            )}
          </View>
        )}
      </ScrollView>
      {actionBtn}
      {acceptedBidderUserId && (
        <GiveReviewModal
          open={openRating}
          onClose={setOpenRating}
          reviewedId={acceptedBidderUserId}
        />
      )}
      {acceptedBid && (
        <HiredModal
          bid={acceptedBid}
          openHired={showHiredModal}
          setOpenHired={(val: boolean) => dispatch(setShowHiredModal(val))}
        />
      )}
    </>
  );
};

export default ViewJob;

const getStyles = (theme: any) =>
  StyleSheet.create({
    jobStatusCont: {
      backgroundColor: theme.white,
      margin: 10,
      borderRadius: 10,
      flexDirection: 'column',
      alignItems: 'flex-start',
      rowGap: 5,
      padding: 10,
    },
    boldText: {
      fontFamily: 'InterBold',
      fontSize: 15,
      color: theme.textDark,
      marginLeft: 5,
    },
    bottomBtn: {
      width: '100%',
      backgroundColor: theme.primary,
      color: theme.white,
      fontFamily: 'InterBold',
    },
  });
