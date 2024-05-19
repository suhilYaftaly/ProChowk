import {
  Popover,
  List,
  ListItem,
  Divider,
  ListItemButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import ConversationListItem from "./ConversationListItem";
import Text from "@reusable/Text";
import { paths } from "@/routes/Routes";
import { useUserStates } from "@/redux/reduxStates";
import { IConversationResponse } from "../../../../../backend/src/types/commonTypes";
import { getUserParticipantObject } from "@/graphql/operations/conversation";

type Props = {
  conversations: IConversationResponse[];
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  onMarkSuccess: () => void;
  // onViewConversation: (
  //   conversationId: string,
  //   hasSeenLatestMessage: boolean
  // ) => void;
};
export default function ConversationsPopover({
  conversations,
  anchorEl,
  setAnchorEl,
  onMarkSuccess,
}: Props) {
  const navigate = useNavigate();
  const closePopover = () => setAnchorEl(null);
  const { userId } = useUserStates();

  const handleSeeAllConversations = () => {
    navigate(paths.conversationsView);
    closePopover();
  };

  const open = Boolean(anchorEl);
  const id = open ? "conversations-popover" : undefined;

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={closePopover}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <List sx={{ maxWidth: 600 }}>
        {conversations?.map((conversation) => {
          const { hasSeenLatestMessages } = getUserParticipantObject(
            conversation,
            userId
          );
          return (
            <ConversationListItem
              key={conversation.id}
              conversation={conversation}
              userId={userId as string}
              onMarkSuccess={onMarkSuccess}
              hasSeenLatestMessages={hasSeenLatestMessages}
              onClick={closePopover}
            />
          );
        })}
        {conversations && (
          <>
            <Divider />
            <ListItem disableGutters disablePadding>
              <ListItemButton
                onClick={handleSeeAllConversations}
                sx={{ justifyContent: "center" }}
              >
                <Text type="subtitle" sx={{ fontSize: 16 }}>
                  See All Conversations
                </Text>
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Popover>
  );
}
