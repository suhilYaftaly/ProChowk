import { Box, useTheme, alpha, useScrollTrigger, Stack } from "@mui/material";

import logo from "../../../public/ProChowkLogo.svg";
import ColorMode from "./ColorMode";
import SignIn from "../signIn/SignIn";

export default function AppHeader() {
  const theme = useTheme();
  const backgroundColor = alpha(theme.palette.background.default, 0.9);
  const trigger = useScrollTrigger({ threshold: 150 });

  return (
    <Box
      boxShadow={1}
      padding={1}
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        backgroundColor,
        opacity: trigger ? 0 : 1,
        transition: "opacity 0.2s ease-in-out",
      }}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <img src={logo} alt={"logo"} width={45} />
        <Stack direction="row" alignItems={"center"}>
          <SignIn />
          <ColorMode />
        </Stack>
      </Stack>
    </Box>
  );
}
