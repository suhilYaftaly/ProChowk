import { messageOps } from "@/graphql/operations/message";
import { useUserStates } from "@/redux/reduxStates";
import { MessagesData, SendMessageVariables } from "@/types/types";
import { useMutation } from "@apollo/client";
import { Box, Button, Input } from "@mui/material";
import React, { useState } from "react";

interface Props {
  conversationId: string;
}

const MessageInput: React.FC<Props> = ({ conversationId }) => {
  const [messageBody, setMessageBody] = useState("");

  const [sendMessage] = useMutation<
    { sendMessage: boolean },
    { senderId: string; conversationId: string; body: string }
  >(messageOps.Mutations.sendMessage);
  const { userId: senderId, firstName } = useUserStates();

  const onSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const newMessage: SendMessageVariables = {
        senderId: senderId as string,
        conversationId,
        body: messageBody,
      };
      const { data, errors } = await sendMessage({
        variables: {
          body: messageBody,
          conversationId,
          senderId: senderId as string,
        },
        /**
         * Optimistically update UI
         */
        optimisticResponse: {
          sendMessage: true,
        },
        update: (cache) => {
          setMessageBody("");
          const existing = cache.readQuery<MessagesData>({
            query: messageOps.Queries.conversationMessages,
            variables: { conversationId },
          }) as MessagesData;

          // cache.writeQuery<MessagesData, { conversationId: string }>({
          //   query: messageOps.Queries.conversationMessages,
          //   variables: { conversationId },
          //   data: {
          //     ...existing,
          //     messages: [
          //       {
          //         id: "",
          //         attachmentId: "",
          //         body: messageBody,
          //         senderId: senderId as string,
          //         conversationId,
          //         sender: {
          //           id: senderId as string,
          //           name: firstName as string,
          //         },
          //         createdAt: new Date(Date.now()),
          //         updatedAt: new Date(Date.now()),
          //       },
          //       ...existing.messages,
          //     ],
          //   },
          // });
        },
      });

      if (!data?.sendMessage || errors) {
        throw new Error("Error sending message");
      }
    } catch (error: any) {
      console.log("onSendMessage error", error);
    }
  };

  return (
    <Box px={4} py={6} width="100%">
      <form onSubmit={onSendMessage}>
        <Input
          value={messageBody}
          onChange={(event) => setMessageBody(event.target.value)}
          size="medium"
          placeholder="New message"
          color="success"
          // _focus={{
          //   boxShadow: "none",
          //   border: "1px solid",
          //   borderColor: "whiteAlpha.300",
          // }}
          // _hover={{
          //   borderColor: "whiteAlpha.300",
          // }}
        />
        <Button type="submit">asdf</Button>
      </form>
    </Box>
  );
};
export default MessageInput;
