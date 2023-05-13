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
import { useAppDispatch } from "../../utils/hooks";
import { logOut } from "../../redux/slices/userSlice";

export default function UserProfileAvatar() {
  const dispatch = useAppDispatch();
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

  const handleLogOut = () => {
    dispatch(logOut());
    handleClose();
  };

  const iconItem = [
    {
      label: "My Profile",
      icon: (
        <Avatar
          alt={user?.name}
          src={user?.picture}
          sx={{ width: 24, height: 24 }}
        />
      ),
    },
    {
      label: "My Inbox",
      icon: <InboxIcon />,
    },
  ];
  const otherItems = [{ label: "My Ads" }];

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
              <Typography variant="h6">Welcome, {user?.given_name}</Typography>
            </Box>
            <Divider />
            <nav aria-label="items with icon">
              <List>
                {iconItem.map((item) => (
                  <ListItem disablePadding key={item.label}>
                    <ListItemButton>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </nav>
            <Divider />
            <nav aria-label="items">
              <List>
                {otherItems.map((item) => (
                  <ListItem disablePadding key={item.label}>
                    <ListItemButton>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </nav>
            <Divider />
            <nav aria-label="log out">
              <List>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogOut}>
                    <ListItemText primary="Log Out" />
                  </ListItemButton>
                </ListItem>
              </List>
            </nav>
          </Box>
        </Popover>
      </>
    );
  } else return null;
}
