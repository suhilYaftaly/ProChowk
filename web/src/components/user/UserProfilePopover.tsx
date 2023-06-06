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

import { useUserStates } from "../../redux/reduxStates";
import UserProfile from "./userProfile/UserProfile";
import LogOut from "./LogOut";

export default function UserProfilePopover() {
  const { user } = useUserStates();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const openPopover = (event: MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const closePopover = () => setAnchorEl(null);

  if (user) {
    return (
      <>
        <IconButton
          aria-describedby={id}
          onClick={openPopover}
          // onMouseEnter={openPopover}
        >
          <Avatar
            alt={user?.name}
            src={user?.image?.picture}
            sx={{ width: 24, height: 24 }}
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
          <Box
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            // onMouseLeave={closePopover}
          >
            <Box sx={{ padding: "8px 16px" }}>
              <Typography variant="h6">{user?.name}</Typography>
            </Box>
            <Divider />
            <nav aria-label="items with icon">
              <List>
                <UserProfile onScreenClose={closePopover} />
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
                <LogOut onLogout={closePopover} />
              </List>
            </nav>
          </Box>
        </Popover>
      </>
    );
  } else return null;
}
