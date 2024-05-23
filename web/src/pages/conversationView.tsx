import { Card, Divider, Grid, Skeleton, Stack } from "@mui/material";
import { useEffect, useState } from "react";

import AppContainer from "@reusable/AppContainer";
import Text from "@reusable/Text";
import { useParams } from "react-router-dom";
import FeedWrapper from "@/components/user/conversation/ConversationWrapper";
import ConversationsWrapper from "@/components/user/conversation/ConversationsWrapper";
import { useRespVal } from "@/utils/hooks/hooks";
import useConversation from "@/hooks/useConversation";
import { useConversationStates } from "@/redux/reduxStates";

export default function ConversationView() {
  const [page, setPage] = useState(1);
  const { conversationId } = useParams();

  const { getUserConversation, messagesError, messagesLoading } =
    useConversation();

  useEffect(
    () => getUserConversation(conversationId as string, page),
    [conversationId]
  );
  const { unreadConsCount } = useConversationStates();

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
    getUserConversation(conversationId as string, page);
  };
  if (messagesError) return <Text>{messagesError.message}</Text>;

  return (
    <>
      <AppContainer>
        <Grid container spacing={2} sx={{ mb: useRespVal(2, undefined) }}>
          <Grid item xs={12} md={3}>
            <Card variant="outlined">
              <AppContainer addCard sx={{ m: 0 }}>
                <Text type="subtitle">
                  Conversations ({unreadConsCount ?? 0})
                </Text>
                <ConversationsWrapper />
              </AppContainer>
            </Card>
          </Grid>
          <Grid item xs={12} md={9}>
            <AppContainer addCard sx={{ m: 0 }} cardSX={{ p: 0 }}>
              <FeedWrapper />
            </AppContainer>
          </Grid>
        </Grid>
      </AppContainer>
    </>
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
