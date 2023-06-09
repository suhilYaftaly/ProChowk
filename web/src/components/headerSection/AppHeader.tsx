import { useTheme, alpha, useScrollTrigger, Stack, Card } from "@mui/material";
import { NavLink } from "react-router-dom";

import ColorModeIcon from "./ColorModeIcon";
import AppLogo from "@reusable/AppLogo";
import UserProfilePopover from "../user/UserProfilePopover";
import LogInButton from "../user/login/LogInButton";
import { ppx, ppy } from "@config/configConst";

export default function AppHeader() {
  const theme = useTheme();
  const backgroundColor = alpha(theme.palette.background.default, 0.9);
  const trigger = useScrollTrigger({ threshold: 110 });

  return (
    <Card
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        backgroundColor,
        opacity: trigger ? 0 : 1,
        transition: "opacity 0.2s ease-in-out",
        py: ppy,
        px: ppx,
        boxShadow: 1,
        borderRadius: 0,
      }}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <NavLink to={"/"}>
          <AppLogo />
        </NavLink>
        <Stack direction="row" alignItems={"center"}>
          <LogInButton />
          <UserProfilePopover />
          <ColorModeIcon />
        </Stack>
      </Stack>
    </Card>
  );
}
