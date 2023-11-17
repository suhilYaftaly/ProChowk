import { ChangeEvent, FormEvent, useState } from "react";
import {
  Stack,
  TextField,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
  Card,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { validateEmail, validatePassword } from "@utils/utilFuncs";
import { useRegisterUser } from "@gqlOps/user";
import { useAppDispatch } from "@utils/hooks/hooks";
import { logIn, userProfileBegin, userProfileError } from "@rSlices/userSlice";
import { paths } from "@/routes/Routes";
import Text from "@reusable/Text";
import CenteredStack from "@reusable/CenteredStack";

export default function SignUp() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [disableSignUpBtn, setDisableSignUpBtn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formError, setFormError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { registerUserAsync, loading, error } = useRegisterUser();

  const handleFDataChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setDisableSignUpBtn(false);
    setFormData((pv) => ({ ...pv, [name]: value }));
  };

  const validateFields = () => {
    let error = false;
    if (formData.name?.length < 4) {
      setFormError((pv) => ({
        ...pv,
        name: "Name must be more than 3 chars.",
      }));
      error = true;
    }
    if (!validateEmail(formData.email)) {
      setFormError((pv) => ({ ...pv, email: "Invalid email format." }));
      error = true;
    }

    if (validatePassword(formData.password)) {
      setFormError((pv) => ({
        ...pv,
        password: validatePassword(formData.password),
      }));
      error = true;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError((pv) => ({
        ...pv,
        confirmPassword: "Password and Confirm Password must match.",
      }));
      error = true;
    }

    return error;
  };

  const onRegister = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const error = validateFields();
    if (error) return;
    setDisableSignUpBtn(true);

    dispatch(userProfileBegin());
    registerUserAsync({
      variables: {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      },
      onSuccess: (d) => {
        dispatch(logIn(d));
        navigate(paths.verifyEmail);
      },
      onError: (err) => dispatch(userProfileError({ message: err?.message })),
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <CenteredStack sx={{ maxWidth: 500 }}>
      <Card sx={{ p: 2 }}>
        <Stack sx={{ textAlign: "center", mb: 3 }}>
          <Text type="subtitle" sx={{ mb: 0.5 }}>
            Sign Up
          </Text>
          <Text type="caption">Create a new account</Text>
        </Stack>
        <Stack component="form" spacing={2} noValidate onSubmit={onRegister}>
          <TextField
            label="Name"
            placeholder={"your name"}
            variant="outlined"
            name={"name"}
            value={formData.name}
            onChange={handleFDataChange}
            error={Boolean(formError.name)}
            helperText={formError.name}
            size="small"
            required
          />
          <TextField
            label="Email"
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
          <TextField
            label="Password"
            placeholder={"your password"}
            variant="outlined"
            name={"password"}
            value={formData.password}
            onChange={handleFDataChange}
            error={Boolean(formError.password)}
            helperText={formError.password}
            size="small"
            required
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm Password"
            placeholder={"Confirm Password"}
            variant="outlined"
            name={"confirmPassword"}
            value={formData.confirmPassword}
            onChange={handleFDataChange}
            error={Boolean(formError.confirmPassword)}
            helperText={formError.confirmPassword}
            size="small"
            required
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={togglePasswordVisibility}>
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <div style={{ marginTop: 10 }}></div>
          <Text type="caption" textAlign={"center"}>
            By signing up, you agree to our terms of service and privacy policy.
          </Text>
          <Button
            type="submit"
            variant="contained"
            disabled={disableSignUpBtn}
            sx={{ borderRadius: 5 }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Sign Up"
            )}
          </Button>
          {error && (
            <Alert severity="error" color="error">
              {error.message}
            </Alert>
          )}
          <Text type="caption" sx={{ textAlign: "center", fontWeight: 550 }}>
            Already have an account?{" "}
            <Link
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(paths.login)}
            >
              Login
            </Link>
          </Text>
        </Stack>
      </Card>
    </CenteredStack>
  );
}
