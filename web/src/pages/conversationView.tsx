import { Divider, Skeleton, Stack } from "@mui/material";
import { useEffect, useState } from "react";

import AppContainer from "@reusable/AppContainer";
import Text from "@reusable/Text";
import { useParams } from "react-router-dom";
import { useConversationMessages } from "@/graphql/operations/message";
import FeedWrapper from "@/components/user/conversation/ConversationWrapper";
import ConversationsWrapper from "@/components/user/conversation/ConversationsWrapper";
import { useAppSelector } from "@/utils/hooks/hooks";

export default function ConversationView() {
  const [page, setPage] = useState(1);
  const { conversationId } = useParams();

  const { conversationMessagesAsync, data, loading } =
    useConversationMessages();

  useEffect(() => getUserConversation(), [conversationId]);
  const { unreadConsCount } = useAppSelector((state) => state.conversation);

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
    <AppContainer>
      {loading ? (
        <NotiSkeleton />
      ) : (
        <Stack
          direction={"row"}
          sx={{ alignItems: "center", justifyContent: "space-between" }}
        >
          <AppContainer addCard sx={{ pr: 5, width: "25%" }}>
            <Text type="subtitle">Conversations ({unreadConsCount ?? 0})</Text>
            <ConversationsWrapper />
          </AppContainer>
          <AppContainer addCard sx={{ m: 0, width: "75%" }}>
            <FeedWrapper />
          </AppContainer>
        </Stack>
      )}
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
