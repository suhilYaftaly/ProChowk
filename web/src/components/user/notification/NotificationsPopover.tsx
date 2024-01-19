import {
  Popover,
  List,
  ListItem,
  Divider,
  ListItemButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import NotificationListItem from "./NotificationListItem";
import Text from "@reusable/Text";
import { TNotification } from "@gqlOps/notification";
import { paths } from "@/routes/Routes";

type Props = {
  notifications: TNotification[] | undefined;
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  onMarkSuccess: () => void;
};
export default function NotificationsPopover({
  notifications,
  anchorEl,
  setAnchorEl,
  onMarkSuccess,
}: Props) {
  const navigate = useNavigate();
  const closePopover = () => setAnchorEl(null);

  const handleSeeAllNotifications = () => {
    navigate(paths.notificationsView);
    closePopover();
  };

  const open = Boolean(anchorEl);
  const id = open ? "notifications-popover" : undefined;

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={closePopover}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <List sx={{ maxWidth: 600 }}>
        {notifications?.slice(0, 5).map((notification) => (
          <NotificationListItem
            key={notification.id}
            notification={notification}
            onClick={closePopover}
            onMarkSuccess={onMarkSuccess}
          />
        ))}
        {notifications && notifications.length > 5 && (
          <>
            <Divider />
            <ListItem disableGutters disablePadding>
              <ListItemButton
                onClick={handleSeeAllNotifications}
                sx={{ justifyContent: "center" }}
              >
                <Text type="subtitle" sx={{ fontSize: 16 }}>
                  See All Notifications
                </Text>
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Popover>
  );
}
