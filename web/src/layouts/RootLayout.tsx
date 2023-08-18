import { Outlet, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useTheme } from "@mui/material";
import { useEffect } from "react";

import AppHeader from "@components/headerSection/AppHeader";
import UserLocationPermission from "@user/UseUserLocation";
import { setNavigator } from "@routes/navigationService";

export default function RootLayout() {
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  return (
    <>
      <AppHeader />
      <Outlet />
      <UserLocationPermission />
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
      />
    </>
  );
}
