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
import labels from "@/constants/labels";
import GoogleLoginButton from "@/components/headerSection/logIn/google/GoogleLoginButton";
import CredentialLogin from "@/components/user/login/CredentialLogin";

export default function Login() {
  const [value, setValue] = useState(0);
  const handleTabChange = (value: number) => setValue(value);

  return (
    <Box sx={pageCont}>
      <Box sx={contentCont} boxShadow={4}>
        <AppLogo />
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{ marginY: 2 }}
        >
          {labels.appName}
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 5 }}>
          <Tabs
            value={value}
            onChange={(_, value) => handleTabChange(value)}
            aria-label="service category tabs"
          >
            <Tab label="Log In" />
            <Tab label="Sign Up" />
          </Tabs>
        </Box>
        <Box sx={{ px: 2 }}>
          <GoogleLoginButton />
          <Divider sx={{ my: 3 }}> or </Divider>
          <CredentialLogin />
        </Box>
      </Box>
    </Box>
  );
}

const pageCont = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "70vh",
} as SxProps<Theme>;

const contentCont = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 2,
  py: 2,
  //   px: 2,
} as SxProps<Theme>;
