import { useState, MouseEvent } from "react";
import { Avatar, Box, Button, IconButton, Popover } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { useUserStates } from "@redux/reduxStates";
import ProfileList from "../myProfile/ProfileList";
import { setOpenJobPost } from "@rSlices/globalModalsSlice";
import { useAppDispatch } from "@hooks/hooks";

export default function DMyProfilePopover() {
  const dispatch = useAppDispatch();
  const { user } = useUserStates();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const openPopover = (event: MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const closePopover = () => setAnchorEl(null);

  const onPostJob = () => {
    closePopover();
    dispatch(setOpenJobPost(true));
  };

  if (user) {
    return (
      <>
        <IconButton
          aria-describedby={id}
          // onClick={openPopover}
          onMouseEnter={openPopover}
        >
          <Avatar
            alt={user?.name}
            src={user?.image?.url}
            sx={{ width: 30, height: 30 }}
          />
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={closePopover}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Box onMouseLeave={closePopover}>
            <ProfileList onItemClick={closePopover} />
            <Box sx={{ m: 2 }}>
              <Button
                variant="contained"
                endIcon={<ChevronRightIcon />}
                onClick={onPostJob}
                size="large"
                fullWidth
              >
                Post A Job
              </Button>
            </Box>
          </Box>
        </Popover>
      </>
    );
  } else return null;
}
