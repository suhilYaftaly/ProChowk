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
import { TConversation } from "@gqlOps/conversation";
import { paths } from "@/routes/Routes";
import { useUserStates } from "@/redux/reduxStates";

type Props = {
  conversations: TConversation[] | undefined;
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
  onMarkSuccess: () => void;
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
        {conversations?.map((conversation) => (
          <ConversationListItem
            key={conversation.id}
            conversation={conversation}
            userId={userId as string}
            onClick={closePopover}
            onMarkSuccess={onMarkSuccess}
          />
        ))}
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
