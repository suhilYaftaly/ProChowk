import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import AppHeader from "@components/headerSection/AppHeader";
import ErrSnackbar from "@reusable/ErrSnackbar";
import { paths } from "@routes/PageRoutes";
import { useSettingsStates } from "@redux/reduxStates";
import { useAppDispatch } from "@/utils/hooks/hooks";
import { setGlobalError, setSessionExpired } from "@rSlices/settingsSlice";
import UserLocationPermission from "@user/UseUserLocation";

export default function RootLayout() {
  const { isSessionExpired, globalError } = useSettingsStates();
  const [showGlobalErr, setShowGlobalErr] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isSessionExpired) navigate(paths.login);
  }, [isSessionExpired]);

  useEffect(() => {
    if (globalError) setShowGlobalErr(true);
  }, [globalError]);

  const onGlobalErrClose = () => {
    setShowGlobalErr(false);
    dispatch(setGlobalError(undefined));
  };

  return (
    <>
      <AppHeader />
      <Outlet />
      <ErrSnackbar
        errMsg={globalError}
        open={showGlobalErr}
        handleClose={onGlobalErrClose}
      />
      <ErrSnackbar
        errMsg="Your Session has Expired, Please Login again!"
        open={isSessionExpired}
        handleClose={() => dispatch(setSessionExpired(false))}
      />
      <UserLocationPermission />
    </>
  );
}
