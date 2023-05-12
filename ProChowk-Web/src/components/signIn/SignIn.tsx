import { Box, Button, Modal, SxProps, Theme, Typography } from "@mui/material";
import { useEffect, useState } from "react";
// import { useGoogleOneTapLogin } from "@react-oauth/google";
import axios from "axios";
import { googleLogout } from "@react-oauth/google";

import GoogleLoginButton from "../../auth/GoogleLoginButton";
import logo from "../../../public/ProChowkLogo.svg";
import { useAppDispatch } from "../../utils/hooks";
import {
  //   setGoogleToken,
  //   setGoogleTokenError,
  setUserProfile,
  setUserProfileError,
} from "../../redux/slices/userSlice";
import { useUserStates } from "../../redux/reduxStates";

export default function SignIn() {
  const dispatch = useAppDispatch();
  const { googleToken: GT, userProfile } = useUserStates();
  const [openModal, setOpenModal] = useState(false);

  //   useGoogleOneTapLogin({
  //     onSuccess: (token) => dispatch(setGoogleToken(token)),
  //     onError: () => dispatch(setGoogleTokenError({ error: "unknown error" })),
  //   });

  const handleOpen = () => setOpenModal(true);

  useEffect(() => {
    if (userProfile) setOpenModal(false);
  }, [userProfile]);

  useEffect(() => {
    if (GT?.access_token || GT?.credential) {
      const token = GT?.access_token ? GT?.access_token : GT?.credential;
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => dispatch(setUserProfile(res.data)))
        .catch((err) => dispatch(setUserProfileError(err)));
    }
  }, [GT]);

  const logOut = () => {
    googleLogout();
    dispatch(setUserProfile(undefined));
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        sx={{ borderRadius: 50 }}
        onClick={userProfile ? logOut : handleOpen}
      >
        Sign {userProfile ? "Out" : "In"}
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
            Pro Chowk
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
