import { Box, Button, Modal, SxProps, Theme, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import GoogleLoginButton from "./google/GoogleLoginButton";
import { useAppDispatch } from "../../../utils/hooks/hooks";
import { logIn } from "../../../redux/slices/userSlice";
import { useUserStates } from "../../../redux/reduxStates";
import { getLocalData } from "../../../utils/utilFuncs";
import labels from "../../../constants/labels";
import { USER_PROFILE_KEY } from "../../../constants/localStorageKeys";
import GoogleOneTapLogin from "./google/GoogleOneTapLogin";
import AppLogo from "../../reusable/AppLogo";

export default function LogInButton() {
  const savedUserProfile = getLocalData(USER_PROFILE_KEY);
  const dispatch = useAppDispatch();
  const { userProfile, isLoggedOut } = useUserStates();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (userProfile) setOpenModal(false);
  }, [userProfile]);

  useEffect(() => {
    if (savedUserProfile) dispatch(logIn(savedUserProfile));
  }, []);

  const handleOpen = () => setOpenModal(true);

  return (
    <>
      {!userProfile?.data && (
        <Button
          variant="outlined"
          size="small"
          sx={{ borderRadius: 50 }}
          onClick={handleOpen}
        >
          Log In
        </Button>
      )}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={contentCont}>
          <AppLogo />
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ marginY: 2 }}
          >
            {labels.appName}
          </Typography>
          <GoogleLoginButton />
        </Box>
      </Modal>
      {!savedUserProfile && !isLoggedOut && <GoogleOneTapLogin />}
    </>
  );
}

const contentCont = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minWidth: 300,
} as SxProps<Theme>;
