import {
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  Stack,
  SwipeableDrawer,
} from "@mui/material";
import { useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";

import Text from "@reusable/Text";
import { useUserStates } from "@/redux/reduxStates";
import ColorModeToggle from "../ColorModeToggle";
import LogOut from "@user/LogOut";
import PostAJob from "@jobs/edits/PostAJob";
import { paths } from "@/routes/Routes";

interface Props {
  open: boolean;
  setOpen: (toggle: boolean) => void;
}
export default function MMyProfileDrawer({ open, setOpen }: Props) {
  const navigate = useNavigate();
  const toggle = () => setOpen(!open);
  const { user } = useUserStates();
  const [openAdd, setOpenAdd] = useState(false);

  const onJobPostSuccess = () => {
    setOpenAdd(false);
    toggle();
  };

  const openMyProfile = () => {
    if (user?.name && user?.id) {
      const username = `${user.name}-${user.id}`.replace(/\s/g, "");
      navigate(paths.user(username));
    }
    toggle();
  };

  return (
    <SwipeableDrawer
      anchor="right"
      open={open}
      onClose={toggle}
      onOpen={toggle}
    >
      <Stack style={{ justifyContent: "space-between", flex: 1 }}>
        <List component="nav">
          <ListItem sx={{ my: 3 }} disableGutters>
            <ListItemButton onClick={openMyProfile}>
              <Avatar
                alt={user?.name}
                src={user?.image?.url}
                sx={{ width: 60, height: 60, mr: 2 }}
              />
              <div>
                <Text type="subtitle">{user?.name}</Text>
                <Text cColor="dark">
                  {user?.userTypes?.includes("contractor")
                    ? "Contractor"
                    : "Client"}
                </Text>
              </div>
            </ListItemButton>
          </ListItem>
          <Divider />
          <ColorModeToggle ui="mobile" />
          <Divider />
          <LogOut ui="mobile" onLogout={() => setOpen(!open)} />
          <Divider />
        </List>
        <Button
          variant="contained"
          sx={{ m: 2 }}
          endIcon={<ChevronRightIcon />}
          onClick={() => setOpenAdd(true)}
          size="large"
        >
          Post A Job
        </Button>
      </Stack>
      <PostAJob
        open={openAdd}
        setOpen={setOpenAdd}
        onSuccess={onJobPostSuccess}
      />
    </SwipeableDrawer>
  );
}
