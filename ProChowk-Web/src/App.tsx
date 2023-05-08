import { useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Grid, Typography } from "@mui/material";

import Header from "./components/header/Header";
import { useSettingsStates } from "./redux/reduxStates";

export default function App() {
  const { colorMode: mode } = useSettingsStates();
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container>
        <Header />
        <Grid item xs={12} padding={1}>
          <Typography>Main Body</Typography>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
