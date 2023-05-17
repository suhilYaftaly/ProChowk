import { useState, MouseEvent } from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";

import { useUserStates } from "../../../redux/reduxStates";
import MyProfile from "./myProfile/MyProfile";
import LogOut from "./LogOut";

export default function UserProfileAvatar() {
  const { user } = useUserStates();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  if (user) {
    return (
      <>
        <IconButton aria-describedby={id} onClick={handleClick}>
          <Avatar
            alt={user?.name}
            src={user?.picture}
            sx={{ width: 24, height: 24 }}
          />
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Box
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            <Box sx={{ padding: "8px 16px" }}>
              <Typography variant="h6">Welcome, {user?.firstName}</Typography>
            </Box>
            <Divider />
            <nav aria-label="items with icon">
              <List>
                <MyProfile onScreenClose={handleClose} />
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary="My Inbox" />
                  </ListItemButton>
                </ListItem>
              </List>
            </nav>
            <Divider />
            <nav aria-label="items">
              <List>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText primary="My Ads" />
                  </ListItemButton>
                </ListItem>
              </List>
            </nav>
            <Divider />
            <nav aria-label="log out">
              <List>
                <LogOut onLogout={handleClose} />
              </List>
            </nav>
          </Box>
        </Popover>
      </>
    );
  } else return null;
}
