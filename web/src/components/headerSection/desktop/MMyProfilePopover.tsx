import { useState, MouseEvent } from "react";
import { Avatar, Box, Divider, IconButton, Popover } from "@mui/material";

import { useUserStates } from "@redux/reduxStates";
import UserMenuOptions from "../myProfile/UserMenuOptions";
import PostJobBtn from "../PostJobBtn";

export default function DMyProfilePopover() {
  const { user } = useUserStates();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "myProfile-popover" : undefined;

  const openPopover = (event: MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const closePopover = () => setAnchorEl(null);

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
            <UserMenuOptions onItemClick={closePopover} />
            <Divider />
            <Box sx={{ m: 2 }}>
              <PostJobBtn onSubmit={closePopover} />
            </Box>
          </Box>
        </Popover>
      </>
    );
  } else return null;
}
