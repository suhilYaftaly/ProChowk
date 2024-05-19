import React from "react";
import { Stack } from "@mui/material";
import { useUserStates } from "@/redux/reduxStates";
import { useParams } from "react-router-dom";

import Messages from "@/components/chat/Messages";
import MessageInput from "@/components/chat/Input";
import AppContainer from "@/components/reusable/AppContainer";
import MessagesHeader from "@/components/chat/MessagesHeader";

const FeedWrapper: React.FC = () => {
  const { userId } = useUserStates();
  const { conversationId } = useParams();

  return (
    <Stack sx={{ justifyContent: "flex-start" }}>
      {conversationId && typeof conversationId === "string" ? (
        <>
          <MessagesHeader
            userId={userId as string}
            conversationId={conversationId}
          />
          <AppContainer sx={{ m: 0, overflow: "auto", height: "75vh" }}>
            <Messages
              userId={userId as string}
              conversationId={conversationId}
            />
          </AppContainer>
          <AppContainer sx={{ m: 0, width: "100%", overflow: "auto" }}>
            <MessageInput conversationId={conversationId} />
          </AppContainer>
        </>
      ) : (
        // <NoConversationSelected />
        <p>No conversation selected</p>
      )}
    </Stack>
  );
};
export default FeedWrapper;
