import { useEffect, useState } from "react";
import { IconButton, Badge, useTheme } from "@mui/material";
import Notifications from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";

import { useUserNotifications } from "@gqlOps/notification";
import { useUserStates } from "@/redux/reduxStates";
import NotificationsPopover from "./NotificationsPopover";
import { useIsMobile } from "@/utils/hooks/hooks";
import { paths } from "@/routes/Routes";

export default function NotificationIcon() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { userId } = useUserStates();
  const whiteC = theme.palette.common.white;
  const isMobile = useIsMobile();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const { userNotificationsAsync, data } = useUserNotifications();
  const notifications = data?.userNotifications?.notifications;
  const count = notifications?.filter(
    (notification) => !notification.read
  ).length;

  useEffect(() => getUserNotifications(), [userId]);

  const getUserNotifications = () => {
    if (userId) {
      userNotificationsAsync({ variables: { userId } });
    }
  };

  const openPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) navigate(paths.notificationsView);
    else openPopover(event);
  };

  return (
    <>
      <IconButton size="small" sx={{ color: whiteC }} onClick={onIconClick}>
        <Badge badgeContent={count} color="error" overlap="circular">
          <Notifications />
        </Badge>
      </IconButton>
      {!isMobile && notifications && (
        <NotificationsPopover
          notifications={notifications}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          onMarkSuccess={getUserNotifications}
        />
      )}
    </>
  );
}
