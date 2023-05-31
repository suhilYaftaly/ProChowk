import { useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import AppHeader from "./components/headerSection/AppHeader";
import { useSettingsStates } from "./redux/reduxStates";
import MainDashboard from "./screens/MainDashboard";
import useUserLocation from "./components/user/useUserLocation";

export default function App() {
  useUserLocation();
  const { colorMode: mode } = useSettingsStates();
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppHeader />
      <MainDashboard />
    </ThemeProvider>
  );
}
