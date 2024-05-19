import React, { useState } from "react";
import {
  IConversationResponse,
  IParticipantResponse,
} from "../../../../../backend/src/types/commonTypes";
import ConversationItem from "./ConversationListItem";
import {
  TConversation,
  getUserParticipantObject,
  useDeleteConversation,
} from "@/graphql/operations/conversation";
import { Box } from "@mui/material";
import { useUserStates } from "@/redux/reduxStates";

interface ConversationListProps {
  conversations: Array<IConversationResponse>;
  onViewConversation: (
    conversationId: string,
    hasSeenLatestMessage: boolean
  ) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onViewConversation,
}) => {
  const { userId } = useUserStates();

  /**
   * Mutations
   */

  const { deleteConversationAsync, loading } = useDeleteConversation();

  const onDeleteConversation = async (conversationId: string) => {
    try {
      deleteConversationAsync({
        variables: {
          conversationId,
        },
      });
      // ,
      //   {
      //     loading: "Deleting conversation",
      //     success: "Conversation deleted",
      //     error: "Failed to delete conversation",
      //   };
    } catch (error) {
      console.log("onDeleteConversation error", error);
    }
  };
  console.log("error", conversations);
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
            onClick={() =>
              onViewConversation(conversation.id, hasSeenLatestMessages)
            }
            onDeleteConversation={onDeleteConversation}
          />
        );
      })}
    </Box>
  );
};
export default ConversationList;
