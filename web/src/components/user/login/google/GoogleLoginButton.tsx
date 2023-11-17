import { Alert, Button, CircularProgress, Stack } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "@utils/hooks/hooks";
import { userProfileError, logIn, userProfileBegin } from "@rSlices/userSlice";
import { useGLogin } from "@gqlOps/user";
import { openUserIfNewUser } from "@/utils/utilFuncs";
import { GoogleIcon } from "@components/JSXIcons";

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
    <Stack sx={{ alignItems: "center" }}>
      <Button
        variant="outlined"
        onClick={() => login()}
        color="inherit"
        startIcon={
          loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <GoogleIcon size={20} />
          )
        }
        disabled={loading}
        sx={{ borderRadius: 5 }}
      >
        Log In with Google
      </Button>
      {error && (
        <Alert severity="error" color="error" sx={{ mt: 1 }}>
          {error.message}
        </Alert>
      )}
    </Stack>
  );
}
