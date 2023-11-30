import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Divider, Skeleton, Stack } from "@mui/material";

import { useUserStates } from "@redux/reduxStates";
import { useUser } from "@gqlOps/user";
import { useJob } from "@gqlOps/job";
import UserSection from "@jobs/jobView/UserSection";
import CenteredStack from "@reusable/CenteredStack";
import JobPreview from "@jobs/jobPost/JobPreview";
import ChipSkeleton from "@reusable/skeleton/ChipSkeleton";

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
    <CenteredStack mmx={0} addCard>
      {loading && <JobSkeleton />}
      {job?.job && <JobPreview job={job?.job} />}
      <Divider sx={{ my: 4 }} />
      <UserSection user={user} loading={userLoading} />
    </CenteredStack>
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
    <Skeleton variant="text" sx={{ width: "20%" }} />
    <Skeleton variant="text" sx={{ width: "90%" }} />
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
