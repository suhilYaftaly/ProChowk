import Stack from "@mui/joy/Stack";
import { Button, Grid, Box } from "@mui/material";

import logo from "../../../public/ProChowkLogo.svg";
import ColorMode from "./ColorMode";

export default function Header() {
  return (
    <Grid item xs={12}>
      <Box boxShadow={1} padding={1}>
        <Stack
          direction="row"
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <img src={logo} alt={"logo"} width={60} />
          <Stack direction="row" alignItems={"center"} spacing={1}>
            <Button variant="outlined" style={{ borderRadius: 50 }}>
              LOGIN
            </Button>
            <Button variant="contained" style={{ borderRadius: 50 }}>
              SIGN UP
            </Button>
            <ColorMode />
          </Stack>
        </Stack>
      </Box>
    </Grid>
  );
}
