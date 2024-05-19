import {
  Avatar,
  CircularProgress,
  ListItem,
  ListItemButton,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import { Circle, MessageTwoTone } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { TConversation, useMarkConversationAsRead } from "@gqlOps/conversation";
import Text from "@reusable/Text";
import { paths } from "@/routes/Routes";
import { IConversationResponse } from "../../../../../backend/src/types/commonTypes";

type Props = {
  conversation: IConversationResponse;
  userId?: string;
  hasSeenLatestMessages?: boolean;
  selectedConversationId?: string;
  onClick?: (id: string) => void;
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
  console.log(hasSeenLatestMessages);
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

  const icon = (
    <Avatar
      alt={conversation.latestMessage?.sender?.name}
      // src={conversation.latestMessage?.sender?.image?.url}
      sx={{ width: 45, height: 45, mr: 1 }}
    />
  );

  return (
    <ListItem disableGutters>
      <ListItemButton
        onClick={markAndNavigateToConversation}
        disabled={loading}
        sx={{
          gap: 2,
          color: iconColor,
          backgroundColor: id ? "transparent" : primaryC10,
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
            <Text type="subtitle" sx={{ fontSize: 18, fontWeight: "bold" }}>
              {latestMessage?.sender.name}
            </Text>
            {latestMessage?.body && (
              <Text>
                {latestMessage?.body.length > 15
                  ? `${latestMessage.body.substring(0, 15)} ...`
                  : latestMessage.body}
              </Text>
            )}
          </div>
          {hasSeenLatestMessages == false && (
            <Circle color="primary" sx={{ width: 12, height: 12, ml: 2 }} />
          )}
        </Stack>
      </ListItemButton>
    </ListItem>
  );
}
