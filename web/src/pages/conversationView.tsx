import { Divider, List, Pagination, Skeleton, Stack } from "@mui/material";
import { useEffect, useState } from "react";

import AppContainer from "@reusable/AppContainer";
import ConversationListItem from "@user/conversation/ConversationListItem";
import { TConversation, useUserConversations } from "@gqlOps/conversation";
import { useUserStates } from "@/redux/reduxStates";
import Text from "@reusable/Text";
import { useParams } from "react-router-dom";
import { useConversationMessages } from "@/graphql/operations/message";

export default function ConversationView() {
  const [page, setPage] = useState(1);
  const { conversationId } = useParams();

  const { conversationMessagesAsync, data, loading } =
    useConversationMessages();
  const messages = data?.messages?.messages;
  const totalCount = data?.messages?.totalCount;
  console.log(data);

  useEffect(() => getUserConversation(), [conversationId]);

  const getUserConversation = (currentPage = page) => {
    if (conversationId) {
      conversationMessagesAsync({
        variables: { conversationId },
      });
    }
  };

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
    getUserConversation(value);
  };

  return (
    <AppContainer addCard>
      <>
        <Stack
          direction={"row"}
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <Text type="subtitle">Conversations ({messages?.length})</Text>
        </Stack>
        {loading ? (
          <NotiSkeleton />
        ) : (
          <>
            {/* <List>
              {conversations?.map((conversation: TConversation) => (
                <Stack key={conversation.id}>
                  <Divider />
                  <ConversationListItem
                    conversation={conversation}
                    onMarkSuccess={() => getUserConversation()}
                  />
                </Stack>
              ))}
            </List> */}
            {/* {totalCount && totalCount > pageSize && (
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{ display: "flex", justifyContent: "center", mt: 2 }}
              />
            )} */}
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
