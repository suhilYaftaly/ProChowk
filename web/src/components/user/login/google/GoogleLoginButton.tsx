import { Alert, Button, CircularProgress } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleIcon from "@mui/icons-material/Google";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "@utils/hooks/hooks";
import { userProfileError, logIn, userProfileBegin } from "@rSlices/userSlice";
import userOps, { IGoogleLoginInput, IGoogleLoginData } from "@gqlOps/user";
import { openUserIfNewUser } from "@/utils/utilFuncs";

interface Props {
  setRedirectToHome: (redirect: boolean) => void;
}

export default function GoogleLoginButton({ setRedirectToHome }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [googleLogin, { loading, error }] = useMutation<
    IGoogleLoginData,
    IGoogleLoginInput
  >(userOps.Mutations.googleLogin);

  const login = useGoogleLogin({
    onSuccess: async (token) => {
      setRedirectToHome(false);
      try {
        dispatch(userProfileBegin());
        const { data } = await googleLogin({
          variables: { accessToken: token.access_token },
        });
        const userData = data?.googleLogin;
        if (userData) {
          dispatch(logIn(userData));
          openUserIfNewUser({ user: userData, navigate });
        } else throw new Error();
      } catch (error: any) {
        dispatch(userProfileError({ message: error?.message }));
      }
    },
    onError: (error) => dispatch(userProfileError({ message: error })),
  });

  return (
    <>
      <Button
        variant="contained"
        onClick={() => login()}
        startIcon={loading ? <CircularProgress size={20} /> : <GoogleIcon />}
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
