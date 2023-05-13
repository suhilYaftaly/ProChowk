import { Button } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleIcon from "@mui/icons-material/Google";
import axios from "axios";

import { useAppDispatch } from "../../../utils/hooks";
import {
  googleTokenSuccess,
  googleTokenError,
  userProfileError,
  userProfileBegin,
  logIn,
} from "../../../redux/slices/userSlice";

export default function GoogleLoginButton() {
  const dispatch = useAppDispatch();
  const login = useGoogleLogin({
    onSuccess: (token) => {
      dispatch(googleTokenSuccess(token));
      dispatch(userProfileBegin());
      if (token?.access_token) {
        axios
          .get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token?.access_token}`,
            {
              headers: {
                Authorization: `Bearer ${token?.access_token}`,
                Accept: "application/json",
              },
            }
          )
          .then((res) => dispatch(logIn(res.data)))
          .catch((err) => dispatch(userProfileError(err)));
      }
    },
    onError: (error) => dispatch(googleTokenError(error)),
  });

  return (
    <Button
      variant="contained"
      onClick={() => login()}
      startIcon={<GoogleIcon />}
    >
      Log In with Google
    </Button>
  );
}
