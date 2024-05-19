import { client } from "@/graphql/apollo-client";
import { conversationOps } from "@/graphql/operations/conversation";
import { ConversationsData } from "@/types/types";
import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import Text from "../reusable/Text";

interface MessagesHeaderProps {
  userId: string;
  conversationId: string;
}

const MessagesHeader: React.FC<MessagesHeaderProps> = ({
  userId,
  conversationId,
}) => {
  const [username, setUsername] = useState("");

  const data = client.readQuery<ConversationsData>({
    query: conversationOps.Queries.userConversations,
  });

  useEffect(() => {
    const conversations = data?.conversations;
    if (conversations) {
      const conversation = conversations.conversations.find(
        (conversation) => conversation.id === conversationId
      );

      if (conversation) {
        const name = conversation.participants.find((p) => p.user.id != userId)
          ?.user.name;
        setUsername(name || "");
      }
    }
  }, [data?.conversations]);

  return (
    <Stack
      alignContent="center"
      justifyContent="end"
      spacing={6}
      py={3}
      px={{ base: 4, md: 0 }}
      borderBottom="1px solid"
      borderColor="whiteAlpha.200"
    >
      <Text sx={{ fontSize: 20 }}>{username}</Text>
    </Stack>
  );
};
export default MessagesHeader;
