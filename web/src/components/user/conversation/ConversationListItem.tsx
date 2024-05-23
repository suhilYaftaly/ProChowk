import {
  Avatar,
  CircularProgress,
  ListItem,
  ListItemButton,
  Stack,
  alpha,
  useTheme,
} from "@mui/material";
import { Circle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { TConversation } from "@gqlOps/conversation";
import Text from "@reusable/Text";
import { paths } from "@/routes/Routes";
import { IConversationResponse } from "../../../../../backend/src/types/commonTypes";
import useConversation from "@/hooks/useConversation";
import { useUserStates } from "@/redux/reduxStates";

type Props = {
  conversation: IConversationResponse;
  userId?: string;
  hasSeenLatestMessages: boolean;
  selectedConversationId?: string;
  onClick?: (id: string) => void;
  onMarkSuccess?: (data: TConversation) => void;
  onDeleteConversation?: (conversationId: string) => void;
};
export default function ConversationListItem({
  conversation,
  hasSeenLatestMessages,
  onClick,
}: Props) {
  const navigate = useNavigate();
  const theme = useTheme();
  const primaryC = theme.palette.primary.light;
  const iconColor = theme.palette.text?.dark;
  const primaryC10 = alpha(primaryC, 0.1);
  const { id, latestMessage } = conversation;
  const { userId } = useUserStates();

  const { onViewConversation, markAsReadLoading } = useConversation();

  const markAndNavigateToConversation = async () => {
    onClick && onClick(id);
    await onViewConversation(conversation.id, hasSeenLatestMessages);
    navigate(paths.conversationView(id));
  };

  const icon = (
    <Avatar
      alt={
        conversation.participants.filter((x) => x.id !== userId).at(0)?.user
          .name
      }
      // src={conversation.latestMessage?.sender?.image?.url}
      sx={{ width: 45, height: 45, mr: 1 }}
    />
  );

  return (
    <ListItem disableGutters>
      <ListItemButton
        onClick={markAndNavigateToConversation}
        disabled={markAsReadLoading}
        sx={{
          gap: 2,
          color: iconColor,
          backgroundColor: id ? "transparent" : primaryC10,
          alignItems: "center",
        }}
      >
        {markAsReadLoading ? (
          <CircularProgress color="inherit" size={24} />
        ) : (
          icon
        )}
        <Stack
          direction={"row"}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <div>
            <Text type="subtitle" sx={{ fontSize: 14, fontWeight: "bold" }}>
              {
                conversation.participants.filter((x) => x.id !== userId).at(0)
                  ?.user.name
              }
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
