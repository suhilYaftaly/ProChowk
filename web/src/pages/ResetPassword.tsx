import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { Visibility, VisibilityOff, LockPerson } from "@mui/icons-material";

import { useRequestPasswordReset, useResetPassword } from "@gqlOps/user";
import { useUserStates } from "@redux/reduxStates";
import { useAppDispatch } from "@utils/hooks/hooks";
import { logIn, setUserProfileInfo } from "@rSlices/userSlice";
import CenteredStack from "@reusable/CenteredStack";
import { USER_PROFILE_KEY } from "@constants/localStorageKeys";
import { validateEmail, validatePassword } from "@utils/utilFuncs";

export default function ResetPassword() {
  const { user } = useUserStates();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");
  const {
    resetPasswordAsync,
    loading: resetLoading,
    error: resetError,
  } = useResetPassword();
  const {
    requestPasswordResetAsync,
    loading: reqLoading,
    error: reqError,
    data: reqData,
  } = useRequestPasswordReset();
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmNewPass: "",
  });
  const [formError, setFormError] = useState({
    email: "",
    newPassword: "",
    confirmNewPass: "",
  });
  const [show, setShow] = useState({ newPassword: false });

  //if logged in and email is verified then redirect screen
  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  //if logged in from another tab with localStorage then update redux and redirect screen
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === USER_PROFILE_KEY && e.newValue) {
        const updatedUser = JSON.parse(e.newValue);
        if (updatedUser && !user) {
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

  /**returns true if there is/are error(s) */
  const validateResetPassFields = () => {
    let error = false;
    if (validatePassword(formData.newPassword)) {
      setFormError((pv) => ({
        ...pv,
        newPassword: validatePassword(formData.newPassword),
      }));
      error = true;
    }

    if (formData.newPassword !== formData.confirmNewPass) {
      setFormError((pv) => ({
        ...pv,
        confirmNewPass: "Password and Confirm Password must match.",
      }));
      error = true;
    }

    return error;
  };

  const handleResetPassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateResetPassFields()) return;

    if (token && formData.newPassword) {
      resetPasswordAsync({
        variables: { token, newPassword: formData.newPassword },
        onSuccess: (dt) => {
          dispatch(logIn(dt));
          toast.success("Password reset successful.");
          navigate("/");
        },
      });
    }
  };

  const handleRequestPasswordReset = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      setFormError((pv) => ({ ...pv, email: "Invalid email format." }));
      return;
    }
    if (formData.email) {
      requestPasswordResetAsync({
        variables: { email: formData.email },
        onSuccess: () =>
          toast.success(
            "Password reset request sent to your email. Please check your email."
          ),
      });
    }
  };

  const handleFDataChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((pv) => ({ ...pv, [name]: value }));
  };

  const toggleShow = (name: keyof typeof show) => {
    setShow((pv) => ({ ...pv, [name]: !pv[name] }));
  };

  return (
    <CenteredStack sx={{ maxWidth: 500, textAlign: "center" }} addCard>
      {token ? (
        <Stack
          component="form"
          spacing={2}
          noValidate
          onSubmit={handleResetPassword}
        >
          <div>
            <Typography variant="h4">Change your password</Typography>
            <Typography variant="body1" sx={{ my: 2 }}>
              Enter a new password below to change your password
            </Typography>
          </div>
          <TextField
            label="New Password"
            placeholder={"your new password"}
            variant="outlined"
            name={"newPassword"}
            value={formData.newPassword}
            onChange={handleFDataChange}
            error={Boolean(formError.newPassword)}
            helperText={formError.newPassword}
            size="small"
            required
            type={show.newPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => toggleShow("newPassword")}>
                    {show.newPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm Password"
            placeholder={"Confirm your new password"}
            variant="outlined"
            name={"confirmNewPass"}
            value={formData.confirmNewPass}
            onChange={handleFDataChange}
            error={Boolean(formError.confirmNewPass)}
            helperText={formError.confirmNewPass}
            size="small"
            required
            type={show.newPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => toggleShow("newPassword")}>
                    {show.newPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" sx={{ borderRadius: 5 }}>
            {resetLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Change Password"
            )}
          </Button>
          {resetError && (
            <Alert severity="error" color="error">
              {resetError.message}
            </Alert>
          )}
        </Stack>
      ) : (
        <Stack
          component="form"
          spacing={2}
          noValidate
          onSubmit={handleRequestPasswordReset}
        >
          <div>
            <LockPerson sx={{ width: 170, height: 170 }} />
            <Typography variant="h4">Forgot your password</Typography>
            <Typography variant="body1" sx={{ my: 2 }}>
              Enter your email below and we will send you a link to reset your
              password. If you can't find the email check your spam folder.
            </Typography>
            <Typography variant="body1" sx={{ my: 2 }}>
              Please note that if you signed up using Google this form will not
              work.
            </Typography>
          </div>
          {reqData?.requestPasswordReset && (
            <Alert severity="success" color="success">
              Password reset request sent to your email. Please check your
              email.
            </Alert>
          )}
          <TextField
            label="Email"
            id={"email"}
            placeholder="yours@example.com"
            variant="outlined"
            name={"email"}
            type="email"
            value={formData.email}
            onChange={handleFDataChange}
            error={Boolean(formError.email)}
            helperText={formError.email}
            size="small"
            required
          />
          <Button type="submit" variant="contained" sx={{ borderRadius: 5 }}>
            {reqLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Send Reset Link"
            )}
          </Button>
          {reqError && (
            <Alert severity="error" color="error">
              {reqError?.message}
            </Alert>
          )}
        </Stack>
      )}
    </CenteredStack>
  );
}
