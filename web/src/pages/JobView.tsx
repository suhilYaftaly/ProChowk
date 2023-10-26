import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Stack, Paper, Alert } from "@mui/material";

import { useUserStates } from "@redux/reduxStates";
import { useUser } from "@gqlOps/user";
import { useJob } from "@gqlOps/job";
import { maxWidthPG, ppx, ppy } from "@config/configConst";
import { useRespVal } from "@utils/hooks/hooks";
import UserSection from "@jobs/jobView/UserSection";
import DetailsSection from "@jobs/jobView/DetailsSection";
import CenteredStack from "@/components/reusable/CenteredStack";

export default function JobView() {
  const { userId, jobId } = useParams();
  const { user: loggedInUser } = useUserStates();
  const isMyProfile = userId === loggedInUser?.id;
  const {
    userAsync,
    data: userData,
    loading: userLoading,
    error: userErr,
  } = useUser();
  const user = isMyProfile ? loggedInUser : userData?.user;
  const { jobAsync, data: job, loading, error } = useJob();

  const paperContStyle = {
    px: ppx,
    py: ppy,
    borderRadius: useRespVal(0, undefined),
    borderRight: useRespVal(0, undefined),
    borderLeft: useRespVal(0, undefined),
  };

  //retriev user info if its not my profile
  useEffect(() => {
    if (userId && !isMyProfile) userAsync({ variables: { id: userId } });
  }, [isMyProfile]);

  useEffect(() => {
    if (jobId) jobAsync({ variables: { id: jobId } });
  }, [jobId]);

  return (
    <CenteredStack mmx={0}>
      <Stack spacing={1} sx={{ maxWidth: maxWidthPG, width: "100%" }}>
        <Paper variant="outlined" sx={paperContStyle}>
          {error && (
            <Alert severity="error" color="error">
              {error.message}
            </Alert>
          )}
          <DetailsSection job={job?.job} loading={loading} userId={userId} />
        </Paper>
        <Paper variant="outlined" sx={paperContStyle}>
          {userErr && (
            <Alert severity="error" color="error">
              {userErr.message}
            </Alert>
          )}
          <UserSection user={user} loading={userLoading} />
        </Paper>
      </Stack>
    </CenteredStack>
  );
}
