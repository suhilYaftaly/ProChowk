import { messageOps } from "@/graphql/operations/message";
import { useUserStates } from "@/redux/reduxStates";
import { MessagesData } from "@/types/types";
import { useMutation } from "@apollo/client";
import { Button, Grid, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import { ObjectId } from "bson";

interface Props {
  conversationId: string;
}

const MessageInput: React.FC<Props> = ({ conversationId }) => {
  const [messageBody, setMessageBody] = useState("");

  const [sendMessage] = useMutation<
    { sendMessage: boolean },
    { id: string; senderId: string; conversationId: string; body: string }
  >(messageOps.Mutations.sendMessage);
  const { userId: senderId, firstName } = useUserStates();

  const onSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const newId = new ObjectId().toString();
      const { data, errors } = await sendMessage({
        variables: {
          id: newId,
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

          console.log(existing);

          cache.writeQuery<MessagesData, { conversationId: string }>({
            query: messageOps.Queries.conversationMessages,
            variables: { conversationId },
            data: {
              ...existing,
              messages: [
                {
                  id: newId,
                  attachmentId: null,
                  body: messageBody,
                  senderId: senderId as string,
                  conversationId,
                  sender: {
                    id: senderId as string,
                    name: firstName as string,
                  },
                  createdAt: new Date(Date.now()),
                  updatedAt: new Date(Date.now()),
                },
                ...existing.messages,
              ],
            },
          });
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
    <Stack p={1} width="100%">
      <form onSubmit={onSendMessage}>
        <Stack direction="row">
          <Grid sx={{ width: "90%" }}>
            <TextField
              value={messageBody}
              onChange={(event) => setMessageBody(event.target.value)}
              size="small"
              placeholder="New message"
              color="success"
              fullWidth
            />
          </Grid>
          <Grid>
            <Button type="submit" sx={{ pl: "2" }}>
              Send
            </Button>
          </Grid>
        </Stack>
      </form>
    </Stack>
  );
};
export default MessageInput;
