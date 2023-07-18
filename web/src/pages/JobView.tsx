import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Stack, Paper, Alert } from "@mui/material";

import { useUserStates } from "@redux/reduxStates";
import { useSearchUser } from "@gqlOps/user";
import { useGetJob } from "@gqlOps/jobs";
import { pp, layoutCardsMaxWidth } from "@config/configConst";
import { useRespVal } from "@utils/hooks/hooks";
import UserSection from "@jobs/jobView/UserSection";
import DetailsSection from "@jobs/jobView/DetailsSection";

export default function JobView() {
  const { nameId, jobId } = useParams();
  const { user: loggedInUser } = useUserStates();
  const userId = nameId?.split("-")?.[1];
  const isMyProfile = userId === loggedInUser?.id;
  const {
    searchUserAsync,
    data: userData,
    loading: userLoading,
    error: userErr,
  } = useSearchUser();
  const user = isMyProfile ? loggedInUser : userData?.searchUser;
  const { getJobAsync, data: job, loading, error } = useGetJob();

  const paperContStyle = {
    p: 2,
    borderRadius: useRespVal(0, undefined),
    borderRight: useRespVal(0, undefined),
    borderLeft: useRespVal(0, undefined),
  };

  //retriev user info if its not my profile
  useEffect(() => {
    if (userId && !isMyProfile) searchUserAsync({ userId });
  }, [isMyProfile]);

  useEffect(() => {
    if (jobId) getJobAsync({ id: jobId });
  }, [jobId]);

  return (
    <Stack
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        my: pp,
      }}
    >
      <Stack spacing={1} sx={{ maxWidth: layoutCardsMaxWidth, width: "100%" }}>
        <Paper variant="outlined" sx={paperContStyle}>
          {error && (
            <Alert severity="error" color="error">
              {error.message}
            </Alert>
          )}
          <DetailsSection job={job} loading={loading} />
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
    </Stack>
  );
}
