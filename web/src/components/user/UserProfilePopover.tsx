import { useState, MouseEvent, ReactNode } from "react";
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
import { useNavigate } from "react-router-dom";

import { useUserStates } from "@redux/reduxStates";
import LogOut from "./LogOut";
import { paths } from "@/routes/Routes";
import { isDeveloper } from "@/utils/auth";

export default function UserProfilePopover() {
  const navigate = useNavigate();
  const { user } = useUserStates();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const openPopover = (event: MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const closePopover = () => setAnchorEl(null);

  const openMyProfile = () => {
    closePopover();
    if (user?.name && user?.id) {
      const username = `${user.name}-${user.id}`.replace(/\s/g, "");
      navigate(paths.user(username));
    }
  };
  const openLogsPage = () => {
    closePopover();
    navigate(paths.logs);
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
          <Box
            sx={{ width: "100%", maxWidth: 360 }}
            onMouseLeave={closePopover}
          >
            <List>
              <ListItemComp onClick={openMyProfile}>
                <ListItemIcon>
                  <Avatar
                    alt={user?.name}
                    src={user?.image?.url}
                    sx={{ width: 30, height: 30 }}
                  />
                </ListItemIcon>
                <Typography variant="h6">{user?.name}</Typography>
              </ListItemComp>
            </List>
            <Divider />
            {/* <nav aria-label="items with icon">
              <List>
                <ListItemComp>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="My Inbox" />
                </ListItemComp>
              </List>
            </nav> */}
            {/* <Divider /> */}
            {isDeveloper(user?.roles) && (
              <>
                <nav aria-label="items">
                  <List>
                    <ListItemComp onClick={openLogsPage}>
                      <ListItemText primary="Logs" />
                    </ListItemComp>
                  </List>
                </nav>
                <Divider />
              </>
            )}
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

const ListItemComp = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) => (
  <ListItem disablePadding>
    <ListItemButton onClick={onClick}>{children}</ListItemButton>
  </ListItem>
);
