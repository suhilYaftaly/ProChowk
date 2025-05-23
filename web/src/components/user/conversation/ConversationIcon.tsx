import { useEffect, useState } from "react";
import { IconButton, Badge, useTheme } from "@mui/material";
import Message from "@mui/icons-material/Message";
import { useNavigate } from "react-router-dom";

import { useConversationStates, useUserStates } from "@/redux/reduxStates";
import ConversationsPopover from "./ConversationsPopover";
import { useAppDispatch, useIsMobile } from "@/utils/hooks/hooks";
import { paths } from "@/routes/Routes";
import { setUnreadConsCount } from "@/redux/slices/conversationSlice";
import useConversation from "@/hooks/useConversation";

export default function ConversationIcon() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { userId } = useUserStates();
  const whiteC = theme.palette.common.white;
  const isMobile = useIsMobile();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const dispatch = useAppDispatch();
  const { getUserConversations, data } = useConversation();

  const { unreadConsCount } = useConversationStates();

  const conversations = data?.conversations?.conversations;
  useEffect(() => getUserConversations(), [userId]);

  useEffect(() => {
    let unReadCount = 0;
    data?.conversations?.conversations.forEach((x) =>
      x.participants.forEach((p) => {
        if (!p.hasSeenLatestMessages && p.user.id == userId) {
          console.log(p.hasSeenLatestMessages, p.user.name);
          unReadCount++;
        }
      })
    );
    dispatch(setUnreadConsCount(unReadCount));
  }, [data?.conversations]);

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
        <Badge badgeContent={unreadConsCount} color="error" overlap="circular">
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
