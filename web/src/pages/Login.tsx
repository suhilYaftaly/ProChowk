import {
  Box,
  Divider,
  SxProps,
  Tab,
  Tabs,
  Theme,
  Typography,
} from "@mui/material";
import { useState } from "react";

import AppLogo from "@reusable/AppLogo";
import labels from "@constants/labels";
import GoogleLoginButton from "@components/user/login/google/GoogleLoginButton";
import CredentialLogin from "@components/user/login/CredentialLogin";
import SignUp from "@components/user/signUp/SignUp";

export default function Login() {
  const [value, setValue] = useState(0);
  const handleTabChange = (value: number) => setValue(value);

  return (
    <Box sx={pageCont}>
      <Box sx={contentCont} boxShadow={4}>
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
      </Box>
    </Box>
  );
}

const pageCont = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "75vh",
} as SxProps<Theme>;

const contentCont = {
  borderRadius: 2,
  py: 2,
  width: 300,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
} as SxProps<Theme>;
