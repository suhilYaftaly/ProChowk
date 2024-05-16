import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
import { IMessageResponse } from "../../../../backend/src/graphql/resolvers/message";
import { Avatar, Box, Grid, Stack } from "@mui/material";
import Text from "../reusable/Text";

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

export default function MessageItem({ message, sentByMe }: Props) {
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
      <Stack spacing={1} width="100%">
        <Stack
          direction="row"
          alignContent="center"
          justifyContent={sentByMe ? "flex-end" : "flex-start"}
        >
          {!sentByMe && (
            <Text fontWeight={500} textAlign={sentByMe ? "right" : "left"}>
              {message.sender.name}
            </Text>
          )}
          <Text fontSize={14} color="whiteAlpha.700">
            {formatRelative(message.createdAt, new Date(), {
              locale: {
                ...enUS,
                formatRelative: (token) =>
                  formatRelativeLocale[
                    token as keyof typeof formatRelativeLocale
                  ],
              },
            })}
          </Text>
        </Stack>
        <Grid
          direction="row"
          justifyContent={sentByMe ? "flex-end" : "flex-start"}
        >
          <Box
            bgcolor={sentByMe ? "brand.100" : "whiteAlpha.300"}
            px={2}
            py={1}
            borderRadius={12}
            maxWidth="65%"
          >
            <Text>{message.body}</Text>
          </Box>
        </Grid>
      </Stack>
    </Stack>
  );
}
