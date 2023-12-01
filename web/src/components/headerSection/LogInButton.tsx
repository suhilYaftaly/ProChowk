import { Button, CircularProgress, Stack, SxProps, Theme } from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "@utils/hooks/hooks";
import { logIn } from "@rSlices/userSlice";
import { useUserStates } from "@redux/reduxStates";
import { getLocalData } from "@utils/utilFuncs";
import { USER_PROFILE_KEY } from "@constants/localStorageKeys";
import GoogleOneTapLogin from "../user/login/google/GoogleOneTapLogin";
import { paths } from "@/routes/Routes";

interface Props {
  sx?: SxProps<Theme>;
}
export default function LogInButton({ sx }: Props) {
  const savedUserProfile = getLocalData(USER_PROFILE_KEY);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userProfile, isLoggedOut } = useUserStates();

  useEffect(() => {
    if (savedUserProfile) dispatch(logIn(savedUserProfile));
  }, []);

  return (
    <Stack sx={sx}>
      {!userProfile?.data &&
        (userProfile.isLoading ? (
          <CircularProgress size={20} color="primary" />
        ) : (
          <Button
            variant="contained"
            size="small"
            sx={{ borderRadius: 50 }}
            onClick={() => navigate(paths.login)}
          >
            Login
          </Button>
        ))}
      {!savedUserProfile && !isLoggedOut && <GoogleOneTapLogin />}
    </Stack>
  );
}
