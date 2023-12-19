import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid, Skeleton, Stack } from "@mui/material";

import { useUserStates } from "@redux/reduxStates";
import { useUser } from "@gqlOps/user";
import { useJob } from "@gqlOps/job";
import JobPreview from "@jobs/jobPost/JobPreview";
import ChipSkeleton from "@reusable/skeleton/ChipSkeleton";
import PostedBy from "@jobs/jobPost/PostedBy";
import AppContainer from "@reusable/AppContainer";
import { useRespVal } from "@/utils/hooks/hooks";

export default function JobView() {
  const { userId, jobId } = useParams();
  const { user: loggedInUser } = useUserStates();
  const isMyProfile = userId === loggedInUser?.id;
  const { userAsync, data: userData, loading: userLoading } = useUser();
  const user = isMyProfile ? loggedInUser : userData?.user;
  const { jobAsync, data: job, loading } = useJob();

  //retriev user info if its not my profile
  useEffect(() => {
    if (userId && !isMyProfile) userAsync({ variables: { id: userId } });
  }, [isMyProfile]);

  useEffect(() => {
    if (jobId) jobAsync({ variables: { id: jobId } });
  }, [jobId]);

  return (
    <AppContainer>
      <Grid container spacing={2} sx={{ mb: useRespVal(2, undefined) }}>
        <Grid item xs={12} md={8.7}>
          <AppContainer addCard sx={{ m: 0 }}>
            {loading && <JobSkeleton />}
            {job?.job && <JobPreview job={job?.job} />}
          </AppContainer>
        </Grid>
        <Grid item xs={12} md={3.3}>
          <AppContainer addCard sx={{ m: 0 }} cardSX={{ p: 0 }}>
            <PostedBy user={user} loading={userLoading} />
          </AppContainer>
        </Grid>
      </Grid>
    </AppContainer>
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
