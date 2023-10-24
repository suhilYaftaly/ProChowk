import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAppDispatch } from "../../utils/hooks/hooks";
import { logOut } from "../../redux/slices/userSlice";
import Text from "../reusable/Text";

interface Props {
  onLogout?: () => void;
  ui?: "desktop" | "mobile";
}

export default function LogOut({ onLogout, ui = "desktop" }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const iconColor = theme.palette.text?.dark;

  const handleLogOut = () => {
    dispatch(logOut());
    onLogout && onLogout();
    navigate("/");
  };

  if (ui === "desktop") {
    return (
      <ListItem disablePadding>
        <ListItemButton onClick={handleLogOut}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Log Out" />
        </ListItemButton>
      </ListItem>
    );
  } else {
    return (
      <ListItem disableGutters>
        <ListItemButton onClick={handleLogOut}>
          <ListItemIcon>
            <LogoutIcon sx={{ color: iconColor }} />
          </ListItemIcon>
          <Text type="subtitle">Log Out</Text>
        </ListItemButton>
      </ListItem>
    );
  }
}
