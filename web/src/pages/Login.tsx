import { Box, Card, Divider, Link, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import GoogleLoginButton from "@user/login/google/GoogleLoginButton";
import CredentialLogin from "@user/login/CredentialLogin";
import { useUserStates } from "@redux/reduxStates";
import labels from "@/constants/labels";
import Text from "@reusable/Text";
import { paths } from "@/routes/Routes";
import CenteredStack from "@reusable/CenteredStack";

export default function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useUserStates();
  const [redirectToHome, setRedirectToHome] = useState(true);

  useEffect(() => {
    if (user && redirectToHome) navigate("/");
  }, [user]);

  return (
    <CenteredStack sx={{ maxWidth: 500 }}>
      <Card sx={{ py: 2 }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Text type="subtitle" sx={{ mb: 0.5 }}>
            Welcome to {labels.appName}
            <span style={{ color: theme.palette.primary.main }}>.</span>
          </Text>
          <Text type="caption">
            Enter your credentials to access your account
          </Text>
        </Box>
        <Box sx={{ px: 2, textAlign: "center" }}>
          <CredentialLogin setRedirectToHome={setRedirectToHome} />
          <Text type="caption" sx={{ mt: 2, fontWeight: 550 }}>
            New at {labels.appName}?{" "}
            <Link
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(paths.signUp)}
            >
              Sign Up now
            </Link>
          </Text>
          <Divider sx={{ my: 3 }}> or </Divider>
          <GoogleLoginButton setRedirectToHome={setRedirectToHome} />
        </Box>
      </Card>
    </CenteredStack>
  );
}
