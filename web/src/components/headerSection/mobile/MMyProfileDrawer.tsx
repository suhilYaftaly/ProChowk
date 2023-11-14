import { Divider, Stack, SwipeableDrawer } from "@mui/material";

import ProfileList from "../myProfile/ProfileList";
import PostJobBtn from "../PostJobBtn";

interface Props {
  open: boolean;
  setOpen: (toggle: boolean) => void;
}
export default function MMyProfileDrawer({ open, setOpen }: Props) {
  const toggle = () => setOpen(!open);

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={toggle}
      onOpen={toggle}
    >
      <Stack>
        <ProfileList onItemClick={toggle} />
        <Divider />
        <Stack sx={{ m: 2 }}>
          <PostJobBtn onSubmit={toggle} />
        </Stack>
      </Stack>
    </SwipeableDrawer>
  );
}
