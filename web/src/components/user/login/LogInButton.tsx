import { Button } from "@mui/material";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

import { useAppDispatch } from "../../../utils/hooks/hooks";
import { logIn } from "../../../redux/slices/userSlice";
import { useUserStates } from "../../../redux/reduxStates";
import { getLocalData } from "../../../utils/utilFuncs";
import { USER_PROFILE_KEY } from "../../../constants/localStorageKeys";
import GoogleOneTapLogin from "./google/GoogleOneTapLogin";

export default function LogInButton() {
  const savedUserProfile = getLocalData(USER_PROFILE_KEY);
  const dispatch = useAppDispatch();
  const { userProfile, isLoggedOut } = useUserStates();

  useEffect(() => {
    if (savedUserProfile) dispatch(logIn(savedUserProfile));
  }, []);

  return (
    <>
      {!userProfile?.data && (
        <NavLink to={"./login"}>
          <Button
            variant="outlined"
            size="small"
            sx={{ borderRadius: 50 }}
            // onClick={handleOpen}
          >
            Log In
          </Button>
        </NavLink>
      )}
      {!savedUserProfile && !isLoggedOut && <GoogleOneTapLogin />}
    </>
  );
}
