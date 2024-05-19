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
      p={2}
      spacing={4}
      // _hover={{ bg: "whiteAlpha.200" }}
      justifyContent={sentByMe ? "flex-end" : "flex-start"}
      // wordBreak="break-word"
    >
      <Stack spacing={3}>
        <Stack
          direction="row"
          justifyContent={sentByMe ? "flex-end" : "flex-start"}
        >
          <Stack
            direction="row"
            onMouseOver={(e) => setShowDelete(true)}
            onMouseOut={(e) => setShowDelete(false)}
            spacing={1}
          >
            <Grid sx={{ margin: 2, paddingTop: 3.2, paddingRight: 3 }}>
              {sentByMe && showDelete && (
                <Delete onClick={deleteMessage} color="error" />
              )}
            </Grid>
            <Grid
              sx={{
                textJustify: "inter-word",
              }}
            >
              <Text fontSize={10} color="whiteAlpha.700">
                {`${new Date(message.createdAt).toDateString()} / ${new Date(
                  message.createdAt
                ).toLocaleTimeString()}`}
              </Text>
              <Text
                sx={{
                  marginTop: 1,
                  paddingX: 3,
                  paddingY: 1,
                  backgroundColor: !sentByMe ? "Highlight" : "slategray",
                  borderRadius: "10px",
                }}
                fontSize="1em"
              >
                {message.body}
              </Text>
            </Grid>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
