import { useTheme, alpha, useScrollTrigger, Stack, Card } from "@mui/material";

import ColorModeIcon from "./ColorModeIcon";
import AppLogo from "@reusable/AppLogo";
import UserProfilePopover from "@user/UserProfilePopover";
import LogInButton from "@user/login/LogInButton";
import { ppx } from "@config/configConst";
import CenteredStack from "@reusable/CenteredStack";

export default function AppHeader() {
  const theme = useTheme();
  const backgroundColor = alpha(theme.palette.secondary.dark, 0.9);
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
        px: ppx,
        py: 1,
        boxShadow: 1,
        borderRadius: 0,
        pointerEvents: trigger ? "none" : "auto",
      }}
    >
      <CenteredStack my={0}>
        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
          <AppLogo />
          <Stack direction="row" alignItems={"center"}>
            <LogInButton />
            <UserProfilePopover />
            <ColorModeIcon />
          </Stack>
        </Stack>
      </CenteredStack>
    </Card>
  );
}
