import React, { useState, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Grid, Typography } from "@mui/material";

import Header, { ModeType } from "./components/header/Header";
import { COLOR_MODE_KEY } from "./constants/localStorageKeys";

export default function App() {
  const savedMode = localStorage.getItem(COLOR_MODE_KEY) as ModeType;
  const [mode, setMode] = useState<ModeType>(savedMode ? savedMode : "light");
  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container spacing={2} padding={2}>
        <Grid item xs={12}>
          <Header mode={mode} setMode={setMode} />
        </Grid>
        <Grid item xs={12}>
          <Typography>Main</Typography>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
