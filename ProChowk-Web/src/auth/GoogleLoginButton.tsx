import { Button } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleIcon from "@mui/icons-material/Google";

import { useAppDispatch } from "../utils/hooks";
import { setGoogleToken, setGoogleTokenError } from "../redux/slices/userSlice";

export default function GoogleLoginButton() {
  const dispatch = useAppDispatch();
  const login = useGoogleLogin({
    onSuccess: (token) => dispatch(setGoogleToken(token)),
    onError: (error) => dispatch(setGoogleTokenError(error)),
  });

  return (
    <Button
      variant="contained"
      onClick={() => login()}
      startIcon={<GoogleIcon />}
    >
      Sign In with Google
    </Button>
  );
}
