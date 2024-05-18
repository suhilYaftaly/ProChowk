import {
  CircularProgress,
  Grid,
  ListItem,
  ListItemButton,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import { Circle, DockTwoTone, MessageTwoTone } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { TConversation, useMarkConversationAsRead } from "@gqlOps/conversation";
import Text from "@reusable/Text";
import { paths } from "@/routes/Routes";
import { IConversationResponse } from "../../../../../backend/src/types/commonTypes";

type Props = {
  conversation: TConversation; // IConversationResponse;
  userId: string;
  hasSeenLatestMessages?: boolean;
  selectedConversationId?: string;
  onClick: (id: string) => void;
  onMarkSuccess?: (data: TConversation) => void;
  onDeleteConversation?: (conversationId: string) => void;
};
export default function ConversationListItem({
  conversation,
  hasSeenLatestMessages,
  onClick,
  onMarkSuccess,
}: Props) {
  const navigate = useNavigate();
  const theme = useTheme();
  const primaryC = theme.palette.primary.light;
  const iconColor = theme.palette.text?.dark;
  const primaryC10 = alpha(primaryC, 0.1);
  console.log(conversation);
  const { id, latestMessage } = conversation;

  const { markConversationAsReadAsync, loading } = useMarkConversationAsRead();

  const onMarkAsRead = (conversationId: string) => {
    if (!conversationId) {
      console.log(conversationId);
      // TODO to be changed
      markConversationAsReadAsync({
        variables: { conversationId },
        onSuccess: onMarkSuccess,
      });
    }
    onClick && onClick(conversationId);
  };

  const markAndNavigateToConversation = () => {
    onMarkAsRead(id);
    navigate(paths.conversationView(id));
  };

  const icon = <MessageTwoTone />;

  return (
    <ListItem disableGutters>
      <ListItemButton
        onClick={markAndNavigateToConversation}
        disabled={loading}
        sx={{
          gap: 2,
          color: iconColor,
          backgroundColor: id ? "transparent" : primaryC10, // TODO to be changed
          alignItems: "center",
        }}
      >
        {loading ? <CircularProgress color="inherit" size={24} /> : icon}
        <Stack
          direction={"row"}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <div>
            <Text type="subtitle" sx={{ fontSize: 16 }}>
              {latestMessage?.sender.name}
            </Text>
            {latestMessage?.body && <Text>{latestMessage.body}</Text>}
          </div>
          {!id && ( // TODO to be changed
            <Circle color="primary" sx={{ width: 12, height: 12, ml: 2 }} />
          )}
        </Stack>
      </ListItemButton>
    </ListItem>
  );
}
