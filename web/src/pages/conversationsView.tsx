import { Divider, List, Pagination, Skeleton, Stack } from "@mui/material";
import { useEffect, useState } from "react";

import AppContainer from "@reusable/AppContainer";
import ConversationListItem from "@user/conversation/ConversationListItem";
import {
  getUserParticipantObject,
  useUserConversations,
} from "@gqlOps/conversation";
import { useUserStates } from "@/redux/reduxStates";
import Text from "@reusable/Text";
import { useAppSelector } from "@/utils/hooks/hooks";

export default function ConversationsView() {
  const { userId } = useUserStates();
  const [page, setPage] = useState(1);

  const { userConversationsAsync, data, loading } = useUserConversations();
  const conversations = data?.conversations?.conversations;
  const totalCount = data?.conversations?.totalCount;
  const pageSize = 50;

  const totalPages = totalCount ? Math.ceil(totalCount / pageSize) : 0;

  useEffect(() => getUserConversations(), [userId]);

  const getUserConversations = (currentPage = page) => {
    if (userId) {
      userConversationsAsync({
        variables: { page: currentPage, pageSize },
      });
    }
  };

  const { unreadConsCount } = useAppSelector((x) => x.conversation);

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
    getUserConversations(value);
  };

  return (
    <AppContainer addCard>
      <>
        <Stack
          direction={"row"}
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Text type="subtitle">Conversations ({unreadConsCount})</Text>
        </Stack>
        {loading ? (
          <NotiSkeleton />
        ) : (
          <>
            <List>
              {conversations?.map((conversation) => {
                const { hasSeenLatestMessages } = getUserParticipantObject(
                  conversation,
                  userId
                );
                return (
                  <Stack key={conversation.id}>
                    <Divider />
                    <ConversationListItem
                      conversation={conversation}
                      onMarkSuccess={() => getUserConversations()}
                      hasSeenLatestMessages={hasSeenLatestMessages}
                    />
                  </Stack>
                );
              })}
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
          </>
        )}
      </>
    </AppContainer>
  );
}

const NotiSkeleton = () => (
  <>
    <Divider sx={{ my: 1 }} />
    <Stack direction={"row"} sx={{ alignItems: "center" }}>
      <Skeleton variant="rounded" sx={{ width: 24, height: 24, mr: 2 }} />
      <Stack sx={{ flex: 1 }}>
        <Skeleton variant="text" sx={{ width: "50%" }} />
        <Skeleton variant="text" sx={{ width: "70%" }} />
      </Stack>
    </Stack>
  </>
);
