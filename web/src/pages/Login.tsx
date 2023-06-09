import {
  Box,
  Card,
  Divider,
  SxProps,
  Tab,
  Tabs,
  Theme,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AppLogo from "@reusable/AppLogo";
import labels from "@constants/labels";
import GoogleLoginButton from "@components/user/login/google/GoogleLoginButton";
import CredentialLogin from "@components/user/login/CredentialLogin";
import SignUp from "@components/user/signUp/SignUp";
import { useUserStates } from "@redux/reduxStates";

export default function Login() {
  const navigate = useNavigate();
  const { user } = useUserStates();
  const [value, setValue] = useState(0);

  const handleTabChange = (value: number) => setValue(value);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  return (
    <Box sx={pageCont}>
      <Card sx={{ boxShadow: 4, py: 2, width: 300 }}>
        <Box sx={{ textAlign: "center" }}>
          <AppLogo />
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ marginY: 2 }}
          >
            {labels.appName}
          </Typography>
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
          <GoogleLoginButton />
          <Divider sx={{ my: 3 }}> or </Divider>
          {value === 0 && <CredentialLogin />}
          {value === 1 && <SignUp />}
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
