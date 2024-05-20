import React from "react";
import { IConversationResponse } from "../../../../../backend/src/types/commonTypes";
import ConversationItem from "./ConversationListItem";
import { Box } from "@mui/material";
import { useUserStates } from "@/redux/reduxStates";
import useConversation from "@/hooks/useConversation";

interface ConversationListProps {
  conversations: Array<IConversationResponse>;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
}) => {
  const { userId } = useUserStates();
  const { onDeleteConversation, getUserParticipantObject } = useConversation();

  const sortedConversations = [...conversations].sort(
    (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf()
  );

  return (
    <Box width="100%" overflow="hidden">
      {sortedConversations.map((conversation) => {
        const { hasSeenLatestMessages } = getUserParticipantObject(
          conversation,
          userId
        );
        return (
          <ConversationItem
            key={conversation.id}
            userId={userId as string}
            conversation={conversation}
            hasSeenLatestMessages={hasSeenLatestMessages}
            onDeleteConversation={onDeleteConversation}
          />
        );
      })}
    </Box>
  );
};
export default ConversationList;
