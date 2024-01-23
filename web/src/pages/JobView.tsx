import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, Skeleton, Stack } from "@mui/material";

import { useBidStates, useUserStates } from "@redux/reduxStates";
import { useUser } from "@gqlOps/user";
import { useJob } from "@gqlOps/job";
import JobPreview, { JobStatus } from "@jobs/jobPost/JobPreview";
import ChipSkeleton from "@reusable/skeleton/ChipSkeleton";
import PostedBy from "@jobs/jobPost/PostedBy";
import AppContainer from "@reusable/AppContainer";
import { useAppDispatch, useIsMobile, useRespVal } from "@/utils/hooks/hooks";
import BidThisJob, { isAllowBid } from "@jobs/bid/bidThisJob/BidThisJob";
import { useGetBids } from "@gqlOps/jobBid";
import MiniBidsList from "@jobs/bid/miniBids/MiniBidsList";
import AcceptedBid from "@jobs/bid/AcceptedBid";
import CompleteJobBtn from "@jobs/jobPost/completeJob/CompleteJobBtn";
import GiveReviewModal from "@/components/review/GiveReviewModal";
import BidAcceptedModal from "@jobs/bid/miniBids/BidAcceptedModal";
import { setShowHiredModal } from "@/redux/slices/bidSlice";
import { useGetUserAvgReviews } from "@gqlOps/review";

export default function JobView() {
  const isMobile = useIsMobile();
  const { jobId } = useParams();
  const dispatch = useAppDispatch();
  const { user: loggedInUser } = useUserStates();
  const { showHiredModal } = useBidStates();
  const [openRating, setOpenRating] = useState(false);

  const { getUserAvgReviewsAsync, data: reviewAvgData } =
    useGetUserAvgReviews();
  const userAvgRating = reviewAvgData?.getUserReviews?.averageRating;
  const { userAsync, data: userData, loading: userLoading } = useUser();
  const { jobAsync, data: jobData, loading } = useJob();
  const job = jobData?.job;
  const isMyProfile = job?.userId === loggedInUser?.id;
  const jobPoster = isMyProfile ? loggedInUser : userData?.user;
  const { getBidsAsync, data: bidsData } = useGetBids();
  const bids = bidsData?.getBids;
  const openBids = bids?.filter((bid) => bid.status === "Open");
  const acceptedBid = bids?.find(
    (bid) => bid.status === "Accepted" || bid.status === "Completed"
  );
  const isMyJob = job?.userId === loggedInUser?.id;
  const isJobReadyForCompletion =
    isMyJob &&
    job?.status === "InProgress" &&
    acceptedBid?.status === "Completed";
  const bidder = acceptedBid?.contractor?.user;
  const acceptedBidderUserId = bidder?.id;

  //retriev user info
  useEffect(() => {
    if (job?.userId) {
      userAsync({ variables: { id: job.userId } });
      getUserAvgReviewsAsync({ variables: { userId: job.userId } });
    }
  }, [job?.userId]);

  useEffect(() => {
    if (jobId) jobAsync({ variables: { id: jobId } });
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

  const actionBtn =
    job &&
    (isJobReadyForCompletion ? (
      <CompleteJobBtn jobId={job.id} onSuccess={() => setOpenRating(true)} />
    ) : (
      allowBid && <BidThisJob job={job} jobPoster={jobPoster} />
    ));

  return (
    <>
      <AppContainer>
        <Grid container spacing={2} sx={{ mb: useRespVal(2, undefined) }}>
          <Grid item xs={12} md={8.6}>
            <AppContainer addCard sx={{ m: 0 }}>
              {loading && <JobSkeleton />}
              {job && (
                <JobPreview job={job} topRightBtn={!isMobile && actionBtn} />
              )}
            </AppContainer>
            {job?.status && (
              <AppContainer addCard sx={{ m: 0 }} cardSX={{ mt: 2 }}>
                <JobStatus job={job} />
              </AppContainer>
            )}
          </Grid>
          <Grid item xs={12} md={3.4}>
            <AppContainer addCard sx={{ m: 0 }} cardSX={{ p: 0 }}>
              <PostedBy
                user={jobPoster}
                loading={userLoading}
                title="Posted By"
                userAvgRating={userAvgRating}
              />
            </AppContainer>
            {!acceptedBid &&
              openBids &&
              openBids?.length > 0 &&
              isMyJob &&
              jobPoster &&
              job && (
                <AppContainer addCard sx={{ m: 0, my: 2 }}>
                  <MiniBidsList bids={openBids} job={job} />
                </AppContainer>
              )}
            {isMyJob && acceptedBid && job && (
              <AppContainer addCard sx={{ m: 0, mt: 2 }} cardSX={{ p: 0 }}>
                <AcceptedBid
                  bid={acceptedBid}
                  job={job}
                  jobPoster={jobPoster}
                />
              </AppContainer>
            )}
          </Grid>
        </Grid>
      </AppContainer>
      {isMobile && actionBtn}
      {acceptedBidderUserId && (
        <GiveReviewModal
          open={openRating}
          onClose={setOpenRating}
          reviewedId={acceptedBidderUserId}
        />
      )}
      <BidAcceptedModal
        open={showHiredModal}
        onClose={(toggle) => dispatch(setShowHiredModal(toggle))}
        bidder={bidder}
      />
    </>
  );
}

const JobSkeleton = () => (
  <>
    <Skeleton variant="text" sx={{ width: "60%" }} />
    <Skeleton variant="text" sx={{ width: "20%", my: 2 }} />
    <Skeleton variant="text" sx={{ width: "20%" }} />
    <Skeleton variant="text" sx={{ width: "90%" }} />
    <Skeleton variant="text" sx={{ width: "90%" }} />
    <Skeleton variant="text" sx={{ width: "70%" }} />
    <Skeleton variant="rectangular" width={"100%"} height={1} sx={{ my: 2 }} />
    <Skeleton variant="text" sx={{ width: "20%", mb: 1 }} />
    <Stack direction={"row"} spacing={1}>
      <Skeleton variant="rounded" width={200} height={180} />
      <Skeleton variant="rounded" width={200} height={180} />
      <Skeleton variant="rounded" width={200} height={180} />
    </Stack>
    <Skeleton variant="rectangular" width={"100%"} height={1} sx={{ my: 2 }} />
    <Skeleton variant="text" sx={{ width: "20%" }} />
    <Skeleton variant="text" sx={{ width: "30%" }} />
    <Skeleton variant="rectangular" width={"100%"} height={1} sx={{ my: 2 }} />
    <Skeleton variant="text" sx={{ width: "20%", mb: 1 }} />
    <Stack direction={"row"} spacing={1}>
      <ChipSkeleton />
      <ChipSkeleton />
      <ChipSkeleton />
    </Stack>
  </>
);
