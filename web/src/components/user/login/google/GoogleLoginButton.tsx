import { Alert, Button, CircularProgress } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleIcon from "@mui/icons-material/Google";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "@utils/hooks/hooks";
import { userProfileError, logIn, userProfileBegin } from "@rSlices/userSlice";
import { useGLogin } from "@gqlOps/user";
import { openUserIfNewUser } from "@/utils/utilFuncs";

interface Props {
  setRedirectToHome: (redirect: boolean) => void;
}

export default function GoogleLoginButton({ setRedirectToHome }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { googleLoginAsync, loading, error } = useGLogin();

  const login = useGoogleLogin({
    onSuccess: async (token) => {
      setRedirectToHome(false);
      dispatch(userProfileBegin());
      googleLoginAsync({
        variables: { accessToken: token.access_token },
        onSuccess: (d) => {
          dispatch(logIn(d));
          openUserIfNewUser({ user: d, navigate });
        },
        onError: (err) => dispatch(userProfileError({ message: err?.message })),
      });
    },
    onError: (error) => dispatch(userProfileError({ message: error })),
  });

  return (
    <>
      <Button
        variant="contained"
        onClick={() => login()}
        startIcon={
          loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <GoogleIcon />
          )
        }
        fullWidth
        disabled={loading}
      >
        Log In with Google
      </Button>
      {error && (
        <Alert severity="error" color="error" sx={{ mt: 1 }}>
          {error.message}
        </Alert>
      )}
    </>
  );
}
