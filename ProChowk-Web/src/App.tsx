import { useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import AppHeader from "./components/headerSection/AppHeader";
import { useSettingsStates } from "./redux/reduxStates";
import MainDetailsSection from "./components/detailsSection/MainDetailsSection";

export default function App() {
  const { colorMode: mode } = useSettingsStates();
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppHeader />
      <MainDetailsSection />
    </ThemeProvider>
  );
}
