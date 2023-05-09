import { Button, Box, Grid, useTheme } from "@mui/material";

import logo from "../../../public/ProChowkLogo.svg";
import ColorMode from "./ColorMode";

export default function AppHeader() {
  const theme = useTheme();

  return (
    <Box
      boxShadow={1}
      padding={1}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Grid container alignItems={"center"} justifyContent={"space-between"}>
        <Grid item>
          <img src={logo} alt={"logo"} width={45} />
        </Grid>
        <Grid item>
          <Grid container alignItems={"center"} spacing={1}>
            <Grid item>
              <Button
                variant="outlined"
                size="small"
                style={{ borderRadius: 50 }}
              >
                LOGIN
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                size="small"
                style={{ borderRadius: 50 }}
              >
                SIGN UP
              </Button>
            </Grid>
            <Grid item>
              <ColorMode />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
