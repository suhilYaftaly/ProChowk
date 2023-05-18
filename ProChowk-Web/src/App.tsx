import { useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import AppHeader from "./components/headerSection/AppHeader";
import { useSettingsStates } from "./redux/reduxStates";
import HomeScreen from "./screens/HomeScreen";
import AppComps from "./components/app/AppComps";

export default function App() {
  const { colorMode: mode } = useSettingsStates();
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppComps />
      <AppHeader />
      <HomeScreen />
    </ThemeProvider>
  );
}
