import { useEffect } from "react";
import { useParams } from "react-router-dom";

import ConversationList from "./ConversationList";
import useConversation from "@/hooks/useConversation";
import { useUserStates } from "@/redux/reduxStates";

const ConversationsWrapper = () => {
  const { userId } = useUserStates();
  const { conversationId } = useParams();

  const {
    subscribeToNewConversations,
    getUserConversations,
    subscibeToConversation,
    error,
    data,
  } = useConversation();

  subscibeToConversation({ conversationId: conversationId as string });

  useEffect(() => getUserConversations(), [userId]);
  /**
   * Execute subscription on mount
   */
  useEffect(() => {
    subscribeToNewConversations();
  }, []);

  if (error) {
    console.log("There was an error fetching conversations");
    return null;
  }
  console.log(data);
  return (
    <ConversationList
      conversations={data?.conversations?.conversations || []}
    />
  );
};
export default ConversationsWrapper;
