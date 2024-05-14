import { Divider, Stack } from "@mui/material";

import ColorThemeToggle from "../ColorThemeToggle";
import DMyProfilePopover from "./MMyProfilePopover";
import LogInButton from "@/components/headerSection/LogInButton";
import AppLogo from "@reusable/AppLogo";
import SwitchUserViewButton from "@user/SwitchUserViewButton";
import NotificationIcon from "@user/notification/NotificationIcon";
import { useUserStates } from "@/redux/reduxStates";
import ConversationIcon from "@/components/user/conversation/ConversationIcon";

export default function DHeader() {
  const { user } = useUserStates();

  return (
    <Stack
      direction="row"
      sx={{ justifyContent: "space-between", alignItems: "center" }}
    >
      <AppLogo type="text" />
      <Stack direction="row" alignItems={"center"}>
        <SwitchUserViewButton />
        <LogInButton sx={{ mr: 1 }} />
        {user && (
          <>
            <LineDivider />
            <NotificationIcon />
            <ConversationIcon />
          </>
        )}
        <LineDivider />
        <ColorThemeToggle />
        <LineDivider />
        <DMyProfilePopover />
      </Stack>
    </Stack>
  );
}

const LineDivider = () => (
  <Divider
    sx={{ height: 20, m: 0.5, borderColor: "gray", borderWidth: 1, mx: 1 }}
    orientation="vertical"
  />
);
