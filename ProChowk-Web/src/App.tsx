import { useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import AppHeader from "./components/headerSection/AppHeader";
import { useSettingsStates } from "./redux/reduxStates";
import HomeScreen from "./screens/HomeScreen";

export default function App() {
  const { colorMode: mode } = useSettingsStates();
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppHeader />
      <HomeScreen />
    </ThemeProvider>
  );
}
