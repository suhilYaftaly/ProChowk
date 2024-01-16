import {
  CircularProgress,
  ListItem,
  ListItemButton,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import { Notifications, Circle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { TNotification, useMarkNotificationAsRead } from "@gqlOps/notification";
import Text from "@reusable/Text";
import { useUserStates } from "@/redux/reduxStates";
import { paths } from "@/routes/Routes";
import { BidIcon } from "@/components/JSXIcons";

type Props = {
  notification: TNotification;
  onClick?: (id: string) => void;
  onMarkSuccess?: (data: TNotification) => void;
};
export default function NotificationListItem({
  notification,
  onClick,
  onMarkSuccess,
}: Props) {
  const navigate = useNavigate();
  const { userId } = useUserStates();
  const theme = useTheme();
  const primaryC = theme.palette.primary.light;
  const iconColor = theme.palette.text?.dark;
  const primaryC10 = alpha(primaryC, 0.1);
  const { id, title, message, read, type, data } = notification;

  const { markNotificationAsReadAsync, loading } = useMarkNotificationAsRead();

  const onMarkAsRead = (notificationId: string) => {
    if (!read) {
      markNotificationAsReadAsync({
        variables: { notificationId },
        onSuccess: onMarkSuccess,
      });
    }
    onClick && onClick(notificationId);
  };

  const getNotificationItemProps = () => {
    switch (type) {
      case "BidPlaced":
        return {
          icons: <BidIcon />,
          onClick: () => {
            onMarkAsRead(id);
            if (userId && data?.jobId) navigate(paths.jobView(data.jobId));
          },
        };
      case "BidAccepted":
        return {
          icons: <BidIcon />,
          onClick: () => {
            onMarkAsRead(id);
            if (userId && data?.jobId) navigate(paths.jobView(data.jobId));
          },
        };
      case "BidRejected":
        return { icons: <BidIcon />, onClick: () => onMarkAsRead(id) };
      default:
        return { icon: <Notifications />, onClick: () => onMarkAsRead(id) };
    }
  };

  const itemProps = getNotificationItemProps();

  return (
    <ListItem disableGutters>
      <ListItemButton
        onClick={itemProps?.onClick}
        disabled={loading}
        sx={{
          gap: 2,
          color: iconColor,
          backgroundColor: read ? "transparent" : primaryC10,
          alignItems: "center",
        }}
      >
        {loading ? (
          <CircularProgress color="inherit" size={24} />
        ) : (
          itemProps?.icons
        )}
        <Stack
          direction={"row"}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <div>
            <Text type="subtitle" sx={{ fontSize: 16 }}>
              {title}
            </Text>
            {message && <Text>{message}</Text>}
          </div>
          {!read && (
            <Circle color="primary" sx={{ width: 12, height: 12, ml: 2 }} />
          )}
        </Stack>
      </ListItemButton>
    </ListItem>
  );
}
