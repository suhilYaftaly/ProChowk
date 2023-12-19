import { Divider, Stack, SwipeableDrawer, useTheme } from "@mui/material";

import ProfileList from "../myProfile/ProfileList";
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

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={toggle}
      onOpen={toggle}
    >
      <Stack sx={{ justifyContent: "space-between", flex: 1 }}>
        <Stack>
          <ProfileList onItemClick={toggle} />
          <Divider />
        </Stack>
        <Stack sx={{ m: 2 }}>
          <PostJobBtn onSubmit={toggle} sx={{ mb: 2 }} />
          <SwitchUserViewButton
            variant="outlined"
            sx={{ borderColor: primaryC }}
          />
        </Stack>
      </Stack>
    </SwipeableDrawer>
  );
}
