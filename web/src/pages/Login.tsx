import { Box, Card, Divider, SxProps, Tab, Tabs, Theme } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AppLogo from "@reusable/AppLogo";
import GoogleLoginButton from "@components/user/login/google/GoogleLoginButton";
import CredentialLogin from "@components/user/login/CredentialLogin";
import SignUp from "@components/user/signUp/SignUp";
import { useUserStates } from "@redux/reduxStates";

export default function Login() {
  const navigate = useNavigate();
  const { user } = useUserStates();
  const [value, setValue] = useState(0);
  const [redirectToHome, setRedirectToHome] = useState(true);

  const handleTabChange = (value: number) => setValue(value);

  useEffect(() => {
    if (user && redirectToHome) navigate("/");
  }, [user]);

  return (
    <Box sx={pageCont}>
      <Card sx={{ boxShadow: 4, py: 2, width: 300 }}>
        <Box sx={{ textAlign: "center" }}>
          <AppLogo size={60} />
        </Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={value}
            onChange={(_, value) => handleTabChange(value)}
            aria-label="service category tabs"
            variant="fullWidth"
          >
            <Tab label="Log In" />
            <Tab label="Sign Up" />
          </Tabs>
        </Box>
        <Box sx={{ px: 2 }}>
          <GoogleLoginButton setRedirectToHome={setRedirectToHome} />
          <Divider sx={{ my: 3 }}> or </Divider>
          {value === 0 && (
            <CredentialLogin setRedirectToHome={setRedirectToHome} />
          )}
          {value === 1 && <SignUp setRedirectToHome={setRedirectToHome} />}
        </Box>
      </Card>
    </Box>
  );
}

const pageCont = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "75vh",
} as SxProps<Theme>;
