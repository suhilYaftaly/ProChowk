import {
  Button,
  CircularProgress,
  Divider,
  List,
  Pagination,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";

import AppContainer from "@reusable/AppContainer";
import NotificationListItem from "@user/notification/NotificationListItem";
import {
  useMarkAllNotificationsAsRead,
  useUserNotifications,
} from "@gqlOps/notification";
import { useUserStates } from "@/redux/reduxStates";
import Text from "@reusable/Text";

export default function NotificationsView() {
  const { userId } = useUserStates();
  const [page, setPage] = useState(1);

  const { markAllNotificationsAsReadAsync, loading: markAllLoading } =
    useMarkAllNotificationsAsRead();
  const { userNotificationsAsync, data } = useUserNotifications();
  const notifications = data?.userNotifications?.notifications;
  const totalCount = data?.userNotifications?.totalCount;
  const pageSize = 50;

  const totalPages = totalCount ? Math.ceil(totalCount / pageSize) : 0;

  useEffect(() => getUserNotifications(), [userId]);

  const getUserNotifications = (currentPage = page) => {
    if (userId) {
      userNotificationsAsync({
        variables: { userId, page: currentPage, pageSize },
      });
    }
  };

  const onMarkAllAsRead = () => {
    if (userId)
      markAllNotificationsAsReadAsync({
        variables: { userId },
        onSuccess: getUserNotifications,
      });
  };

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
    getUserNotifications(value);
  };

  return (
    <AppContainer addCard>
      <Stack
        direction={"row"}
        sx={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <Text type="subtitle">Notifications</Text>
        <Button disabled={markAllLoading} onClick={onMarkAllAsRead}>
          {markAllLoading ? (
            <CircularProgress color="inherit" size={24} />
          ) : (
            "Mark all as read"
          )}
        </Button>
      </Stack>
      <List>
        {notifications?.map((notification) => (
          <Stack key={notification.id}>
            <Divider />
            <NotificationListItem
              notification={notification}
              onMarkSuccess={() => getUserNotifications()}
            />
          </Stack>
        ))}
      </List>
      {totalCount && totalCount > pageSize && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{ display: "flex", justifyContent: "center", mt: 2 }}
        />
      )}
    </AppContainer>
  );
}
