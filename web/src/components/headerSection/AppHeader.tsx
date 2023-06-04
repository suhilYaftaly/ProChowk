import { Box, useTheme, alpha, useScrollTrigger, Stack } from "@mui/material";

import ColorModeIcon from "./ColorModeIcon";
import AppLogo from "../reusable/AppLogo";
import UserProfileAvatar from "../user/UserProfileAvatar";
import LogInButton from "./logIn/LogInButton";
import { NavLink } from "react-router-dom";

export default function AppHeader() {
  const theme = useTheme();
  const backgroundColor = alpha(theme.palette.background.default, 0.9);
  const trigger = useScrollTrigger({ threshold: 110 });

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
        <NavLink to={"./"}>
          <AppLogo />
        </NavLink>
        <Stack direction="row" alignItems={"center"}>
          <LogInButton />
          <UserProfileAvatar />
          <ColorModeIcon />
        </Stack>
      </Stack>
    </Box>
  );
}
