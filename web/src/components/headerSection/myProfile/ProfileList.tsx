import {
  List,
  ListItem,
  ListItemButton,
  Avatar,
  Divider,
  ListItemIcon,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AssignmentIcon from "@mui/icons-material/Assignment";

import LogOut from "@user/LogOut";
import ColorThemeToggle from "../ColorThemeToggle";
import Text from "@reusable/Text";
import { useUserStates } from "@redux/reduxStates";
import { paths } from "@routes/Routes";
import { isDeveloper } from "@/utils/auth";
import { ReactNode } from "react";
import { navigateToUserPage } from "@utils/utilFuncs";
import { useIsMobile } from "@/utils/hooks/hooks";

interface Props {
  onItemClick?: () => void;
}
export default function ProfileList({ onItemClick }: Props) {
  const { user, userView } = useUserStates();
  const navigate = useNavigate();
  const theme = useTheme();
  const iconColor = theme.palette.text?.dark;
  const isMobile = useIsMobile();

  const openMyProfile = () => {
    navigateToUserPage({ user, navigate });
    onItemClick && onItemClick();
  };

  const openLogsPage = () => {
    navigate(paths.logs);
    onItemClick && onItemClick();
  };

  const onPostedJobs = () => navigate(paths.userJobTypes("Posted"));
  const onDraftJobs = () => navigate(paths.userJobTypes("Draft"));

  return (
    <List component="nav">
      <ListItem sx={{ my: 1 }} disableGutters>
        <ListItemButton onClick={openMyProfile}>
          <Avatar
            alt={user?.name}
            src={user?.image?.url}
            sx={{ width: 60, height: 60, mr: 2 }}
          />
          <div>
            <Text type="subtitle">{user?.name}</Text>
            <Text cColor="dark">{userView}</Text>
          </div>
        </ListItemButton>
      </ListItem>
      <Divider />
      {isMobile && <ColorThemeToggle ui="mobile" />}
      {isDeveloper(user?.roles) && (
        <CListItem
          label="Logs"
          onClick={openLogsPage}
          icon={<AssignmentIcon sx={{ color: iconColor }} />}
        />
      )}
      <LogOut ui="mobile" onLogout={onItemClick} />
      <Divider />
      <CListItem label="Posted Jobs" onClick={onPostedJobs} />
      <CListItem label="Draft Jobs" onClick={onDraftJobs} />
    </List>
  );
}

interface CListItemProps {
  onClick?: () => void;
  label: string;
  icon?: ReactNode;
}
/**custom list item */
const CListItem = ({ onClick, label, icon }: CListItemProps) => {
  if (onClick) {
    return (
      <ListItem disableGutters>
        <ListItemButton onClick={onClick}>
          {icon && <ListItemIcon>{icon}</ListItemIcon>}
          <Text type="subtitle">{label}</Text>
        </ListItemButton>
      </ListItem>
    );
  } else {
    return (
      <ListItem>
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <Text type="subtitle">{label}</Text>
      </ListItem>
    );
  }
};
