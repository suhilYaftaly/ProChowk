import { IMessageResponse } from "../../../../backend/src/types/commonTypes";
import { Card, Grid, Stack, alpha, useTheme } from "@mui/material";
import Text from "../reusable/Text";
import { Delete } from "@mui/icons-material";
import { useState } from "react";
import useConversation from "@/hooks/useConversation";

interface Props {
  message: IMessageResponse;
  sentByMe: boolean;
  sysGenerated: boolean;
}

export default function MessageItem({
  message,
  sentByMe,
  sysGenerated,
}: Props) {
  const [showDelete, setShowDelete] = useState<boolean>();

  const { onDeleteMessage, dmData, dmError } = useConversation();
  const deleteMessage = async () => {
    if (confirm("Are you sure?")) {
      await onDeleteMessage(message.id);
    }
  };

  const theme = useTheme();
  const primaryC = theme.palette.primary.main;
  const secondaryC = theme.palette.info;
  const backC = theme.palette.primary.light;
  const error10 = alpha(theme.palette.error.light, 0.1);

  return (
    <Stack
      direction="row"
      p={2}
      spacing={4}
      // _hover={{ bg: "whiteAlpha.200" }}
      justifyContent={
        sysGenerated ? "center" : sentByMe ? "flex-end" : "flex-start"
      }
      // wordBreak="break-word"
    >
      <Stack spacing={3}>
        <Stack
          direction="row"
          justifyContent={
            sysGenerated ? "center" : sentByMe ? "flex-end" : "flex-start"
          }
        >
          <Stack
            direction="row"
            onMouseOver={(e) => setShowDelete(true)}
            onMouseOut={(e) => setShowDelete(false)}
            spacing={1}
          >
            <Grid sx={{ margin: 2, paddingTop: 3.2, paddingRight: 3 }}>
              {sentByMe && !sysGenerated && showDelete && (
                <Delete
                  onClick={deleteMessage}
                  sx={{ cursor: "pointer" }}
                  color="error"
                />
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
              <Card
                variant="outlined"
                sx={{ borderColor: sentByMe ? primaryC : secondaryC }}
              >
                <Text
                  sx={{
                    paddingX: 3,
                    paddingY: 1,
                    backgroundColor: !sentByMe ? secondaryC : "",
                    color: primaryC,
                  }}
                  fontSize="1em"
                >
                  {message.body}
                </Text>
              </Card>
            </Grid>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
