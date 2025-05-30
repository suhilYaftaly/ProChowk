import { useQuery } from "@apollo/client";
import React, { useEffect, useRef } from "react";

import MessageItem from "./MessageItem";
import { messageOps } from "@/graphql/operations/message";
import {
  MessagesData,
  MessagesSubscriptionData,
  MessagesVariables,
} from "@/types/types";
import { Skeleton, Stack } from "@mui/material";
import AppContainer from "../reusable/AppContainer";

interface MessagesProps {
  userId: string;
  conversationId: string;
}

const Messages: React.FC<MessagesProps> = ({ userId, conversationId }) => {
  const { data, loading, error, subscribeToMore } = useQuery<
    MessagesData,
    MessagesVariables
  >(messageOps.Queries.conversationMessages, {
    variables: {
      conversationId,
    },
    onError: ({ message }) => {
      console.log(message);
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const subscribeToMoreMessages = (conversationId: string) => {
    return subscribeToMore({
      document: messageOps.Subscriptions.messageSent,
      variables: {
        conversationId,
      },
      updateQuery: (prev, { subscriptionData }: MessagesSubscriptionData) => {
        if (!subscriptionData.data) return prev;

        const newMessage = subscriptionData.data.messageSent;
        console.log(userId);
        return Object.assign({}, prev, {
          messages:
            newMessage.sender.id === userId || newMessage.isSystemGenerated
              ? prev.messages
              : [newMessage, ...prev.messages],
        });
      },
    });
  };

  const subscribeToDeletedMessages = (conversationId: string) => {
    return subscribeToMore({
      document: messageOps.Subscriptions.messageDeleted,
      variables: {
        conversationId,
      },
      updateQuery: (prev, { subscriptionData }: any) => {
        console.log(subscriptionData);
        if (!subscriptionData.data) return prev;
        const deletedMessage = subscriptionData.data.messageSent;
        console.log(deletedMessage);
        console.log(subscriptionData);
        return Object.assign({}, prev, {
          messages: prev.messages.filter((x) => x.id !== deletedMessage.id),
        });
      },
    });
  };

  useEffect(() => {
    const unsubscribe = subscribeToMoreMessages(conversationId);
    const unsubscribe2 = subscribeToDeletedMessages(conversationId);

    return () => {
      unsubscribe();
      unsubscribe2();
    };
  }, [conversationId]);

  useEffect(() => {
    if (!messagesEndRef.current || !data) return;
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, messagesEndRef.current]);

  if (error) {
    return null;
  }

  return (
    <AppContainer>
      {loading ? (
        <Stack spacing={4} px={4} justifyContent="flex-end" overflow="hidden">
          <Skeleton />
        </Stack>
      ) : (
        data?.messages && (
          <>
            {data.messages.toReversed().map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                sentByMe={message.sender.id === userId}
                sysGenerated={message.isSystemGenerated as boolean}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )
      )}
    </AppContainer>
  );
};
export default Messages;
