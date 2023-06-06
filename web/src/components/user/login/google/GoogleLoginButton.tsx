import { Alert, Button, CircularProgress } from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import GoogleIcon from "@mui/icons-material/Google";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "@utils/hooks/hooks";
import { userProfileError, logIn, userProfileBegin } from "@rSlices/userSlice";
import userOps, { IGoogleLoginInput, IGoogleLoginData } from "@gqlOps/user";

export default function GoogleLoginButton() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [googleLogin, { loading, error }] = useMutation<
    IGoogleLoginData,
    IGoogleLoginInput
  >(userOps.Mutations.googleLogin);

  const login = useGoogleLogin({
    onSuccess: async (token) => {
      try {
        dispatch(userProfileBegin());
        const { data } = await googleLogin({
          variables: { accessToken: token.access_token },
        });
        if (data?.googleLogin) {
          dispatch(logIn(data?.googleLogin));
          navigate("/");
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
