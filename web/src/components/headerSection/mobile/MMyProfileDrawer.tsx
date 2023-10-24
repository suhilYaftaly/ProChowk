import { Button, Stack, SwipeableDrawer } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import ProfileList from "../myProfile/ProfileList";
import { setOpenJobPost } from "@rSlices/globalModalsSlice";
import { useAppDispatch } from "@/utils/hooks/hooks";

interface Props {
  open: boolean;
  setOpen: (toggle: boolean) => void;
}
export default function MMyProfileDrawer({ open, setOpen }: Props) {
  const dispatch = useAppDispatch();
  const toggle = () => setOpen(!open);

  const onPostJob = () => {
    toggle();
    dispatch(setOpenJobPost(true));
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={toggle}
      onOpen={toggle}
    >
      <Stack style={{ justifyContent: "space-between", flex: 1 }}>
        <ProfileList onItemClick={toggle} />
        <Button
          variant="contained"
          sx={{ m: 2 }}
          endIcon={<ChevronRightIcon />}
          onClick={onPostJob}
          size="large"
        >
          Post A Job
        </Button>
      </Stack>
    </SwipeableDrawer>
  );
}
