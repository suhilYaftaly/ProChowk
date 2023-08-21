import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Card,
  CircularProgress,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import EmailIcon from "@mui/icons-material/Email";

import { useSendVerificationEmail, useVerifyEmail } from "@gqlOps/user";
import { useUserStates } from "@redux/reduxStates";
import { useAppDispatch } from "@utils/hooks/hooks";
import { setUserProfile, setUserProfileInfo } from "@rSlices/userSlice";
import { paths } from "@routes/Routes";
import CenteredStack from "@reusable/CenteredStack";
import { openEmailClient } from "@utils/utilFuncs";
import { ppx } from "@config/configConst";
import { USER_PROFILE_KEY } from "@constants/localStorageKeys";

export default function VerifyEmail() {
  const { user } = useUserStates();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const { verifyEmailAsync, data, error } = useVerifyEmail();
  const { sendVerificationEmailAsync, loading: resendLoading } =
    useSendVerificationEmail();

  //verify token
  useEffect(() => {
    if (token) verifyEmailAsync({ variables: { token } });
  }, [token]);

  //if token is verified then update user details and redirect screen
  useEffect(() => {
    if (token && !user?.emailVerified) {
      if (data && user) {
        dispatch(
          setUserProfile({ ...user, emailVerified: true }, data.verifyEmail)
        );
        toast.success("Email Verification successful");
        navigate("/");
      } else if (data) {
        toast.success("Email Verification successful.");
        navigate(paths.login);
      }
    }
  }, [data]);

  //if logged in and email is verified then redirect screen
  useEffect(() => {
    if (user && user.emailVerified) navigate("/");
  }, [user]);

  //if user email is updated from another tab using localStorage then apply it to this tab as well
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === USER_PROFILE_KEY && e.newValue) {
        const updatedUser = JSON.parse(e.newValue);
        if (updatedUser && updatedUser.emailVerified && !user?.emailVerified) {
          dispatch(setUserProfileInfo(updatedUser));
          navigate("/");
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dispatch, navigate]);

  const resendEmail = () => {
    if (user) {
      sendVerificationEmailAsync({
        variables: { email: user.email },
        onSuccess: () =>
          toast.success(
            "Email Verification sent to your email. Please check your email."
          ),
      });
    }
  };

  return (
    <CenteredStack mx={ppx}>
      {error && (
        <Alert severity="error" color="error">
          Email Verification failed. Please try again or request another
          verification.
        </Alert>
      )}
      <Card sx={{ textAlign: "center", p: 3 }}>
        {user && !user.emailVerified && (
          <>
            <IconButton onClick={openEmailClient}>
              <EmailIcon sx={{ width: 170, height: 170 }} />
            </IconButton>
            <Typography variant="h4">
              We've sent a verification email to: {user?.email}
            </Typography>
            <Typography variant="body1" sx={{ mt: 4 }}>
              Click the button in your email to verify your account. If you
              can't find the email check your spam folder or{" "}
              {resendLoading ? (
                <CircularProgress size={15} color="inherit" />
              ) : (
                <Link
                  color="inherit"
                  sx={{ cursor: "pointer" }}
                  onClick={resendEmail}
                >
                  click here to resend
                </Link>
              )}
            </Typography>
          </>
        )}
        {!token && !user && (
          <Link
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(paths.login)}
          >
            Please login to continue!
          </Link>
        )}
      </Card>
    </CenteredStack>
  );
}
