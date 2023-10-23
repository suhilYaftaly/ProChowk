import { Stack } from "@mui/material";

import ColorModeToggle from "../ColorModeToggle";
import AppLogo from "@reusable/AppLogo";
import UserProfilePopover from "@user/UserProfilePopover";
import LogInButton from "@user/login/LogInButton";

export default function DHeader() {
  return (
    <Stack direction="row" sx={{ justifyContent: "space-between" }}>
      <AppLogo />
      <Stack direction="row" alignItems={"center"}>
        <LogInButton />
        <UserProfilePopover />
        <ColorModeToggle />
      </Stack>
    </Stack>
  );
}
