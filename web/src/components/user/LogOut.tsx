import { ListItem, ListItemButton, ListItemText } from "@mui/material";

import { useAppDispatch } from "../../utils/hooks/hooks";
import { logOut } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

interface Props {
  onLogout: () => void;
}

export default function LogOut({ onLogout }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    dispatch(logOut());
    onLogout();
    navigate("/");
  };

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={handleLogOut}>
        <ListItemText primary="Log Out" />
      </ListItemButton>
    </ListItem>
  );
}
