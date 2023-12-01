import { Divider, Stack } from "@mui/material";

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
        <LogInButton sx={{ mr: 1 }} />
        <DMyProfilePopover />
        <Divider
          sx={{
            height: 20,
            m: 0.5,
            borderColor: "gray",
            borderWidth: 1,
            mx: 1,
          }}
          orientation="vertical"
        />
        <ColorThemeToggle />
      </Stack>
    </Stack>
  );
}
