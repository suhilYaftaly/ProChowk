import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '~/src/utils/hooks/hooks';
import { useBidStates, useUserStates } from '~/src/redux/reduxStates';
import { useGetUserAvgReviews, useGetUserReviews } from '~/src/graphql/operations/review';
import { useUser } from '~/src/graphql/operations/user';
import { useJob } from '~/src/graphql/operations/job';
import { useGetBids } from '~/src/graphql/operations/jobBid';
import { ScrollView } from 'tamagui';
import CustomContentLoader from '../reusable/CustomContentLoader';
import JobPreview from './JobPreview';
import Chip from '../reusable/Chip';
import colors from '~/src/constants/colors';
import PostedBy from './PostedBy';
import labels from '~/src/constants/labels';

type Props = {
  jobId?: string | string[];
};

const ViewJob = ({ jobId }: Props) => {
  const dispatch = useAppDispatch();
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
  /* const allowBid = isAllowBid({
    userTypes: loggedInUser?.userTypes,
    userId: loggedInUser?.id,
    jobUserId: job?.userId,
  });

  const actionBtn =
    job &&
    (isJobReadyForCompletion ? (
      <CompleteJobBtn jobId={job.id} onSuccess={() => setOpenRating(true)} />
    ) : (
      allowBid && <BidThisJob job={job} jobPoster={jobPoster} />
    )); */
  return (
    <ScrollView>
      {loading ? (
        <CustomContentLoader type="jobCard" size={20} repeat={1} />
      ) : (
        <View>
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
  );
};

export default ViewJob;

const styles = StyleSheet.create({
  jobStatusCont: {
    backgroundColor: colors.white,
    margin: 10,
    borderRadius: 10,
    flexDirection: 'column',
    flexWrap: 'wrap',
    paddingVertical: 5,
    alignItems: 'center',
    rowGap: 5,
    padding: 5,
  },
  boldText: {
    fontFamily: 'InterBold',
    fontSize: 15,
    color: colors.textDark,
  },
});
