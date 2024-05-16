import { Divider, Grid, Skeleton, Stack } from "@mui/material";
import { useEffect, useState } from "react";

import AppContainer from "@reusable/AppContainer";
import Text from "@reusable/Text";
import { useParams } from "react-router-dom";
import { useConversationMessages } from "@/graphql/operations/message";
import ConversationWrapper from "@/components/user/conversation/ConversationWrapper";
import ConversationsWrapper from "@/components/user/conversation/ConversationsWrapper";

export default function ConversationView() {
  const [page, setPage] = useState(1);
  const { conversationId } = useParams();

  const { conversationMessagesAsync, data, loading } =
    useConversationMessages();
  const messages = data?.messages?.messages;
  const totalCount = data?.messages?.totalCount;

  useEffect(() => getUserConversation(), [conversationId]);

  const getUserConversation = (currentPage = page) => {
    if (conversationId) {
      conversationMessagesAsync({
        variables: { conversationId },
      });
    }
    console.log(data);
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
          <Grid flex="row">
            <ConversationsWrapper />
            <ConversationWrapper />
          </Grid>
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
