import { ListItem, ListItemButton, ListItemText } from "@mui/material";

import { useAppDispatch } from "../../../utils/hooks";
import { logOut } from "../../../redux/slices/userSlice";

interface Props {
  onLogout: () => void;
}

export default function LogOut({ onLogout }: Props) {
  const dispatch = useAppDispatch();

  const handleLogOut = () => {
    dispatch(logOut());
    onLogout();
  };

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={handleLogOut}>
        <ListItemText primary="Log Out" />
      </ListItemButton>
    </ListItem>
  );
}
