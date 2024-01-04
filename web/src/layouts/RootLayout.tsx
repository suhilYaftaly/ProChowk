import { Outlet, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useTheme } from "@mui/material";
import { useEffect } from "react";

import AppHeader from "@components/headerSection/AppHeader";
import UserLocationPermission from "@user/userLocation/UseUserLocation";
import { setNavigator } from "@routes/navigationService";
import GlobalModals from "@pages/GlobalModals";
import { useAppDispatch, useRespVal } from "@/utils/hooks/hooks";
import { setAppLoaded } from "@/redux/slices/settingsSlice";

export default function RootLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAppLoaded(true));
  }, []);
  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  return (
    <>
      <AppHeader />
      <Outlet />
      <UserLocationPermission />
      <GlobalModals />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme.palette.mode}
        style={{ width: useRespVal(undefined, "auto") }}
      />
    </>
  );
}
