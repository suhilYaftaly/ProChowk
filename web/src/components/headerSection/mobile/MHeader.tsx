import { Avatar, IconButton, Stack, useTheme } from "@mui/material";
import { useState } from "react";

import AppLogo from "@reusable/AppLogo";
import LogInButton from "@/components/headerSection/LogInButton";
import MMyProfileDrawer from "./MMyProfileDrawer";
import { useUserStates } from "@/redux/reduxStates";

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
        </Stack>
      </Stack>
      <MMyProfileDrawer open={openDrawer} setOpen={setOpenDrawer} />
    </>
  );
}
