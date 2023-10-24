import { Stack } from "@mui/material";

import ColorThemeToggle from "../ColorThemeToggle";
import DMyProfilePopover from "./MMyProfilePopover";
import LogInButton from "@/components/headerSection/LogInButton";
import AppLogo from "@reusable/AppLogo";

export default function DHeader() {
  return (
    <Stack
      direction="row"
      sx={{ justifyContent: "space-between", alignItems: "center" }}
    >
      <AppLogo type="text" />
      <Stack direction="row" alignItems={"center"}>
        <LogInButton />
        <DMyProfilePopover />
        <ColorThemeToggle />
      </Stack>
    </Stack>
  );
}
