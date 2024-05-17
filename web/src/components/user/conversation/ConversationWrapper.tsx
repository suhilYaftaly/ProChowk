import React from "react";
import { Grid, Stack } from "@mui/material";
import { useUserStates } from "@/redux/reduxStates";
import { useParams } from "react-router-dom";
import Messages from "@/components/chat/Messages";
import MessageInput from "@/components/chat/Input";
import AppContainer from "@/components/reusable/AppContainer";

const ConversationWrapper: React.FC = () => {
  const { userId } = useUserStates();

  const { conversationId } = useParams();

  return (
    <Stack direction="column" width="100%">
      {conversationId && typeof conversationId === "string" ? (
        <>
          <AppContainer sx={{ m: 0, width: "100%" }}>
            <Messages
              userId={userId as string}
              conversationId={conversationId}
            />
          </AppContainer>
          <AppContainer sx={{ m: 0, width: "100%" }}>
            <MessageInput conversationId={conversationId} />
          </AppContainer>
          {/* <MessagesHeader userId={userId} conversationId={conversationId} /> */}
        </>
      ) : (
        // <NoConversationSelected />
        <p>No conversation selected</p>
      )}
    </Stack>
  );
};
export default ConversationWrapper;
