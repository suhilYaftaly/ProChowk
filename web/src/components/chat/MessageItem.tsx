import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { IMessageResponse } from "../../../../backend/src/types/commonTypes";
import { Avatar, Box, Button, Grid, Stack } from "@mui/material";
import Text from "../reusable/Text";
import { Delete } from "@mui/icons-material";
import { useState } from "react";

interface Props {
  message: IMessageResponse;
  sentByMe: boolean;
}

const formatRelativeLocale = {
  lastWeek: "eeee 'at' p",
  yesterday: "'Yesterday at' p",
  today: "p",
  other: "MM/dd/yy",
};

const deleteMessage = () => {
  console.log("Message Deleted");
};

export default function MessageItem({ message, sentByMe }: Props) {
  const [showDelete, setShowDelete] = useState<boolean>();
  return (
    <Stack
      direction="row"
      p={4}
      spacing={4}
      // _hover={{ bg: "whiteAlpha.200" }}
      justifyContent={sentByMe ? "flex-end" : "flex-start"}
      // wordBreak="break-word"
    >
      {!sentByMe && (
        <Grid alignContent="flex-end">
          <Avatar sizes="sm" />
        </Grid>
      )}
      <Stack spacing={3}>
        <Stack
          direction="row"
          justifyContent={sentByMe ? "flex-end" : "flex-start"}
        >
          {!sentByMe && (
            <Text fontWeight={500} textAlign={sentByMe ? "right" : "left"}>
              {message.sender.name}
            </Text>
          )}
          <Stack
            direction="row"
            onMouseOver={(e) => setShowDelete(true)}
            onMouseOut={(e) => setShowDelete(false)}
            spacing={1}
          >
            {sentByMe && showDelete && (
              <Delete onClick={deleteMessage} color="error" />
            )}
            <Grid
              sx={{
                p: "10",
                m: 20,
                borderRadius: 10,
                backgroundColor: "steelblue",
              }}
            >
              <Text fontSize={10} color="whiteAlpha.700">
                {formatRelative(
                  new Date(message.createdAt).getTime(),
                  new Date(message.createdAt),
                  {
                    locale: {
                      ...enUS,
                      formatRelative: (token) =>
                        formatRelativeLocale[
                          token as keyof typeof formatRelativeLocale
                        ],
                    },
                  }
                )}
              </Text>
              <Text fontSize="1em">{message.body}</Text>
            </Grid>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
