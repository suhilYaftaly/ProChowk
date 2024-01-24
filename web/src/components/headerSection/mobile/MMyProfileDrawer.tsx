import { Divider, Stack, SwipeableDrawer, useTheme } from "@mui/material";

import UserMenuOptions from "../myProfile/UserMenuOptions";
import PostJobBtn from "../PostJobBtn";
import SwitchUserViewButton from "@user/SwitchUserViewButton";

interface Props {
  open: boolean;
  setOpen: (toggle: boolean) => void;
}
export default function MMyProfileDrawer({ open, setOpen }: Props) {
  const theme = useTheme();
  const primaryC = theme.palette.primary.main;
  const toggle = () => setOpen(!open);
  const closeDrawer = () => setOpen(false);

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={closeDrawer}
      onOpen={toggle}
    >
      <Stack sx={{ justifyContent: "space-between", flex: 1 }}>
        <Stack>
          <UserMenuOptions onItemClick={closeDrawer} />
          <Divider />
        </Stack>
        <Stack sx={{ m: 2 }}>
          <PostJobBtn onSubmit={closeDrawer} sx={{ mb: 2 }} />
          <SwitchUserViewButton
            variant="outlined"
            sx={{ borderColor: primaryC }}
            onClick={closeDrawer}
          />
        </Stack>
      </Stack>
    </SwipeableDrawer>
  );
}
