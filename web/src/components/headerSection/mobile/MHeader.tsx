import { Avatar, Divider, IconButton, Stack, useTheme } from "@mui/material";
import { useState } from "react";

import AppLogo from "@reusable/AppLogo";
import LogInButton from "@/components/headerSection/LogInButton";
import MMyProfileDrawer from "./MMyProfileDrawer";
import { useUserStates } from "@/redux/reduxStates";
import NotificationIcon from "@user/notification/NotificationIcon";

export default function MHeader() {
  const theme = useTheme();
  const { user } = useUserStates();
  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center" }}
      >
        <AppLogo type="text" />
        <Stack direction="row" alignItems={"center"}>
          <LogInButton />
          {user && (
            <>
              <NotificationIcon />
              <LineDivider />
              <IconButton
                sx={{ color: theme.palette.common.white }}
                onClick={() => setOpenDrawer(!openDrawer)}
              >
                <Avatar
                  alt={user?.name}
                  src={user?.image?.url}
                  sx={{ width: 30, height: 30 }}
                />
              </IconButton>
            </>
          )}
        </Stack>
      </Stack>
      {user && <MMyProfileDrawer open={openDrawer} setOpen={setOpenDrawer} />}
    </>
  );
}

const LineDivider = () => (
  <Divider
    sx={{ height: 20, m: 0.5, borderColor: "gray", borderWidth: 1, mx: 1 }}
    orientation="vertical"
  />
);
