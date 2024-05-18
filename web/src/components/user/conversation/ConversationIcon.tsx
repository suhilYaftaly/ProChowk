import { useEffect, useState } from "react";
import { IconButton, Badge, useTheme } from "@mui/material";
import Message from "@mui/icons-material/Message";
import { useNavigate } from "react-router-dom";

import { useUserStates } from "@/redux/reduxStates";
import ConversationsPopover from "./ConversationsPopover";
import {
  useAppDispatch,
  useAppSelector,
  useIsMobile,
} from "@/utils/hooks/hooks";
import { paths } from "@/routes/Routes";
import { useUserConversations } from "@/graphql/operations/conversation";
import { setUnreadConsCount } from "@/redux/slices/conversationSlice";

export default function ConversationIcon() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { userId } = useUserStates();
  const whiteC = theme.palette.common.white;
  const isMobile = useIsMobile();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const dispatch = useAppDispatch();

  const { userConversationsAsync, data } = useUserConversations();
  const conversations = data?.latestConversations?.conversations;
  console.log(data);
  const { unreadConsCount } = useAppSelector((state) => state.conversation);

  useEffect(() => getUserConversations(), [userId]);

  useEffect(() => {
    const unReadCount =
      data?.latestConversations?.conversations.filter((x) =>
        x.participants.filter(
          (x) => !x.hasSeenLatestMessages && x.user.id == userId
        )
      ).length ?? 0;
    dispatch(setUnreadConsCount(unReadCount));
    console.log(unReadCount);
    console.log(data?.latestConversations);
  }, [data?.latestConversations]);

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
