import { Box, Button, Modal, SxProps, Theme, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import { googleLogout } from "@react-oauth/google";

import GoogleLoginButton from "../../auth/GoogleLoginButton";
import logo from "../../../public/ProChowkLogo.svg";
import { useAppDispatch } from "../../utils/hooks";
import {
  googleTokenSuccess,
  googleTokenError,
  userProfileSuccess,
  userProfileError,
} from "../../redux/slices/userSlice";
import { useUserStates } from "../../redux/reduxStates";
import { decodeJwtToken } from "../../utils/utilFuncs";
import labels from "../../constants/labels";

export default function SignIn() {
  const dispatch = useAppDispatch();
  const { userProfile } = useUserStates();
  const [openModal, setOpenModal] = useState(false);

  useGoogleOneTapLogin({
    onSuccess: (token) => {
      dispatch(googleTokenSuccess(token));
      const decodedToken = decodeJwtToken(token.credential);
      if (decodedToken) {
        dispatch(userProfileSuccess({ ...decodedToken, id: decodedToken.sub }));
      } else dispatch(userProfileError(decodedToken));
    },
    onError: () => dispatch(googleTokenError({ error: "unknown error" })),
  });

  useEffect(() => {
    if (userProfile) setOpenModal(false);
  }, [userProfile]);

  const handleOpen = () => setOpenModal(true);

  const logOut = () => {
    googleLogout();
    dispatch(userProfileSuccess(undefined));
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        sx={{ borderRadius: 50 }}
        onClick={userProfile?.data ? logOut : handleOpen}
      >
        Sign {userProfile?.data ? "Out" : "In"}
      </Button>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={contentCont}>
          <img src={logo} alt={"logo"} width={45} />
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
