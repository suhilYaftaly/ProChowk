import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

import { useAppDispatch } from "../../utils/hooks/hooks";
import { logOut } from "../../redux/slices/userSlice";
import Text from "../reusable/Text";

interface Props {
  onLogout: () => void;
  ui?: "desktop" | "mobile";
}

export default function LogOut({ onLogout, ui = "desktop" }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(logOut());
    onLogout();
    navigate("/");
  };

  if (ui === "desktop") {
    return (
      <ListItem disablePadding>
        <ListItemButton onClick={handleLogOut}>
          <ListItemText primary="Log Out" />
        </ListItemButton>
      </ListItem>
    );
  } else {
    return (
      <ListItem disableGutters>
        <ListItemButton
          onClick={handleLogOut}
          sx={{ justifyContent: "space-between" }}
        >
          <Text type="subtitle">Log Out</Text>
          <LogoutIcon />
        </ListItemButton>
      </ListItem>
    );
  }
}
