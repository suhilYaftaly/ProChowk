import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Card, Link, Typography } from "@mui/material";
import { toast } from "react-toastify";
import EmailIcon from "@mui/icons-material/Email";

import { useSendVerificationEmail, useVerifyEmail } from "@gqlOps/user";
import { useUserStates } from "@/redux/reduxStates";
import { useAppDispatch } from "@/utils/hooks/hooks";
import { setUserProfile } from "@rSlices/userSlice";
import { paths } from "@routes/Routes";
import CenteredStack from "@reusable/CenteredStack";

export default function VerifyEmail() {
  const { user } = useUserStates();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const { verifyEmailAsync, data, error } = useVerifyEmail();
  const { sendVerificationEmailAsync } = useSendVerificationEmail();

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

  return (
    <CenteredStack>
      {error && (
        <Alert severity="error" color="error">
          Email Verification failed. Please try again or request another
          verification.
        </Alert>
      )}
      <Card sx={{ textAlign: "center", p: 3 }}>
        {user && !user.emailVerified && (
          <>
            <EmailIcon sx={{ width: 170, height: 170 }} />
            <Typography variant="h5" sx={{ mb: 2 }}>
              We've sent a verification email to: {user?.email}
            </Typography>
            <Typography>
              Click the button in your email to verify your account. If you
              can't find the email check your spam folder or{" "}
              <Link
                sx={{ cursor: "pointer" }}
                onClick={() =>
                  sendVerificationEmailAsync({
                    variables: { email: user.email },
                  })
                }
              >
                click here to resend
              </Link>
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
