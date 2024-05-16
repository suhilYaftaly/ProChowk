import React from "react";
import { Grid, Stack } from "@mui/material";
import { useUserStates } from "@/redux/reduxStates";
import { useParams } from "react-router-dom";
import Messages from "@/components/chat/Messages";
import MessageInput from "@/components/chat/Input";

const ConversationWrapper: React.FC = () => {
  const { userId } = useUserStates();

  const { conversationId } = useParams();

  return (
    <Grid
      display={{ base: conversationId ? "flex" : "none", md: "flex" }}
      // direction="column"
      width="100%"
    >
      {conversationId && typeof conversationId === "string" ? (
        <>
          <Stack
            // direction="column"
            justifyContent="space-between"
            overflow="hidden"
            flexGrow={1}
          >
            {/* <MessagesHeader userId={userId} conversationId={conversationId} /> */}
            <Messages
              userId={userId as string}
              conversationId={conversationId}
            />
          </Stack>
          <MessageInput conversationId={conversationId} />
        </>
      ) : (
        // <NoConversationSelected />
        <span />
      )}
    </Grid>
  );
};
export default ConversationWrapper;
