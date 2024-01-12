import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid, Skeleton, Stack } from "@mui/material";

import { useUserStates } from "@redux/reduxStates";
import { useUser } from "@gqlOps/user";
import { useJob } from "@gqlOps/job";
import JobPreview, { JobStatus } from "@jobs/jobPost/JobPreview";
import ChipSkeleton from "@reusable/skeleton/ChipSkeleton";
import PostedBy from "@jobs/jobPost/PostedBy";
import AppContainer from "@reusable/AppContainer";
import { useIsMobile, useRespVal } from "@/utils/hooks/hooks";
import BidThisJob, { isAllowBid } from "@jobs/bid/bidThisJob/BidThisJob";
import { useGetBids } from "@gqlOps/jobBid";
import MiniBidsList from "@jobs/bid/miniBids/MiniBidsList";
import AcceptedBid from "@jobs/bid/AcceptedBid";

export default function JobView() {
  const isMobile = useIsMobile();
  const { userId, jobId } = useParams();
  const { user: loggedInUser } = useUserStates();
  const isMyProfile = userId === loggedInUser?.id;
  const { userAsync, data: userData, loading: userLoading } = useUser();
  const jobPoster = isMyProfile ? loggedInUser : userData?.user;
  const { jobAsync, data: jobData, loading } = useJob();
  const job = jobData?.job;
  const { getBidsAsync, data: bidsData } = useGetBids();
  const bids = bidsData?.getBids;
  const filteredBids = bids?.filter(
    (bid) => !bid.isRejected && !bid.isAccepted
  );
  const acceptedBid = bids?.find((bid) => bid.isAccepted);
  const isMyJob = job?.userId === loggedInUser?.id;

  //retriev user info if its not my profile
  useEffect(() => {
    if (userId && !isMyProfile) userAsync({ variables: { id: userId } });
  }, [isMyProfile]);

  useEffect(() => {
    if (jobId) jobAsync({ variables: { id: jobId } });
  }, [jobId]);

  //retrieve bids if its my profile
  useEffect(() => {
    if (isMyJob && job?.id) {
      getBidsAsync({ variables: { filter: { jobId: job.id } } });
    }
  }, [job]);

  //prevent self bidding & must be contractor
  const allowBid = isAllowBid({
    userTypes: loggedInUser?.userTypes,
    userId: loggedInUser?.id,
    jobUserId: job?.userId,
    jobStatus: job?.status,
  });

  return (
    <>
      <AppContainer>
        <Grid container spacing={2} sx={{ mb: useRespVal(2, undefined) }}>
          <Grid item xs={12} md={8.6}>
            <AppContainer addCard sx={{ m: 0 }}>
              {loading && <JobSkeleton />}
              {job && (
                <JobPreview
                  job={job}
                  bidBtn={allowBid && !isMobile && <BidThisJob job={job} />}
                />
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
              />
            </AppContainer>
            {!acceptedBid &&
              filteredBids &&
              filteredBids?.length > 0 &&
              isMyJob &&
              jobPoster &&
              job && (
                <AppContainer addCard sx={{ m: 0, my: 2 }}>
                  <MiniBidsList bids={filteredBids} job={job} />
                </AppContainer>
              )}
            {isMyJob && acceptedBid && job && (
              <AppContainer addCard sx={{ m: 0, my: 2 }} cardSX={{ p: 0 }}>
                <AcceptedBid bid={acceptedBid} job={job} />
              </AppContainer>
            )}
          </Grid>
        </Grid>
      </AppContainer>
      {isMobile && allowBid && job && <BidThisJob job={job} />}
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
