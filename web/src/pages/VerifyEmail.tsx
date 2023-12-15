import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  CircularProgress,
  Divider,
  Link,
  useTheme,
} from "@mui/material";
import { toast } from "react-toastify";
import EmailIcon from "@mui/icons-material/Email";

import { useSendVerificationEmail, useVerifyEmail } from "@gqlOps/user";
import { useUserStates } from "@redux/reduxStates";
import { useAppDispatch } from "@utils/hooks/hooks";
import {
  setTokens,
  setUserProfile,
  setUserProfileInfo,
} from "@rSlices/userSlice";
import { paths } from "@routes/Routes";
import CenteredStack from "@reusable/CenteredStack";
import { USER_PROFILE_KEY } from "@constants/localStorageKeys";
import Text from "@reusable/Text";
import { getLocalTokens } from "@/utils/auth";

export default function VerifyEmail() {
  const theme = useTheme();
  const { user } = useUserStates();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const { verifyEmailAsync, data, error } = useVerifyEmail();
  const { sendVerificationEmailAsync, loading: resendLoading } =
    useSendVerificationEmail();
  const darkColor = theme.palette.text.dark;
  const tokens = getLocalTokens();

  //verify token
  useEffect(() => {
    if (token) verifyEmailAsync({ variables: { token } });
  }, [token]);

  //if token is verified then update user details and redirect screen
  useEffect(() => {
    if (token && !user?.emailVerified) {
      if (data && user) {
        dispatch(setUserProfile({ ...user, emailVerified: true }));
        dispatch(
          setTokens({
            accessToken: data.verifyEmail,
            refreshToken: tokens?.refreshToken,
          })
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
    <CenteredStack sx={{ maxWidth: 500, textAlign: "center" }} addCard>
      {error && (
        <Alert severity="error" color="error">
          Email Verification failed. Please try again or request another
          verification.
        </Alert>
      )}
      {user && !user.emailVerified && (
        <>
          <EmailIcon sx={{ width: 170, height: 170 }} />
          <Text type="title" sx={{ mb: 3 }}>
            Verification Sent
          </Text>
          <Text>
            We've sent a verification email to{" "}
            <span style={{ color: darkColor, fontWeight: 600 }}>
              {user?.email}
            </span>
          </Text>
          <Text>Click the button in your email to verify your account.</Text>
          <Divider sx={{ my: 3 }} />
          <Text>
            If you can't find the email check your{" "}
            <span style={{ color: darkColor, fontWeight: 600 }}>spam</span>{" "}
            folder or{" "}
            {resendLoading ? (
              <CircularProgress size={15} color="inherit" />
            ) : (
              <Link
                color="text.secondary"
                sx={{ cursor: "pointer" }}
                onClick={resendEmail}
              >
                click here to resend
              </Link>
            )}
          </Text>
        </>
      )}
      {!token && !user && (
        <Link sx={{ cursor: "pointer" }} onClick={() => navigate(paths.login)}>
          Please login to continue!
        </Link>
      )}
    </CenteredStack>
  );
}
