import { useUserStates } from "@/redux/reduxStates";
import { Button, Divider, Grid, Stack, TextField } from "@mui/material";
import React, { FormEvent, useEffect, useState } from "react";
import { AttachFile, Send } from "@mui/icons-material";
import useConversation from "@/hooks/useConversation";

interface Props {
  conversationId: string;
}

const MessageInput: React.FC<Props> = ({ conversationId }) => {
  const [messageBody, setMessageBody] = useState("");
  const [attachment, setAttachment] = useState(null);
  const { onSendMessage } = useConversation();

  useEffect(() => {
    if (attachment) {
    }
  }, [attachment]);

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    onSendMessage({
      messageBody,
      conversationId,
      senderId: senderId as string,
      setMessageBody,
      firstName: firstName as string,
      systemGenMessage: false,
    });
  };

  const { userId: senderId, firstName } = useUserStates();

  return (
    <Stack p={1} width="100%">
      <form onSubmit={sendMessage}>
        <Stack direction="row">
          <Grid>
            <input
              id="attachment-btn"
              type="file"
              onChange={(e) => setAttachment(e.target.files[0])}
              style={{ display: "none" }}
            />
            <label htmlFor="attachment-btn">
              <AttachFile color="primary" sx={{ m: 1 }} />
            </label>
          </Grid>
          <Divider
            sx={{
              height: 22,
              m: 1,
              borderColor: "gray",
              borderWidth: 1,
              mx: 0.5,
            }}
            orientation="vertical"
          />
          <Grid sx={{ width: "90%" }}>
            <TextField
              value={messageBody}
              onChange={(event) => setMessageBody(event.target.value)}
              size="small"
              placeholder="New message"
              color="success"
              fullWidth
              variant="standard"
              sx={{ mx: 2 }}
            />
          </Grid>
          <Grid>
            <Button type="submit" sx={{ pl: "2", mx: 1 }}>
              <Send />
            </Button>
          </Grid>
        </Stack>
      </form>
    </Stack>
  );
};
export default MessageInput;
