import { useEffect, useState } from "react";
import { IconButton, Badge, useTheme } from "@mui/material";
import Message from "@mui/icons-material/Message";
import { useNavigate } from "react-router-dom";

import { useUserStates } from "@/redux/reduxStates";
import ConversationsPopover from "./ConversationsPopover";
import { useIsMobile } from "@/utils/hooks/hooks";
import { paths } from "@/routes/Routes";
import { useUserConversations } from "@/graphql/operations/conversation";

export default function ConversationIcon() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { userId } = useUserStates();
  const whiteC = theme.palette.common.white;
  const isMobile = useIsMobile();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const { userConversationsAsync, data } = useUserConversations();
  const conversations = data?.conversations?.conversations;
  const count = conversations?.filter(
    (conversation) => !conversation.name // TODO to be changed to hasSeen
  ).length;
  console.log(conversations);

  useEffect(() => getUserConversations(), [userId]);

  const getUserConversations = () => {
    if (userId) {
      userConversationsAsync({ variables: {} });
    }
  };

  const openPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) navigate(paths.conversationsView);
    else openPopover(event);
  };

  return (
    <>
      <IconButton size="small" sx={{ color: whiteC }} onClick={onIconClick}>
        <Badge badgeContent={count} color="error" overlap="circular">
          <Message />
        </Badge>
      </IconButton>
      {!isMobile && conversations && (
        <ConversationsPopover
          conversations={conversations}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          onMarkSuccess={getUserConversations}
        />
      )}
    </>
  );
}
