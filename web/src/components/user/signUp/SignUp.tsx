import { ChangeEvent, FormEvent, useState } from "react";
import {
  Stack,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { validateEmail } from "@utils/utilFuncs";
import { useRegisterUser } from "@gqlOps/user";
import { useAppDispatch } from "@utils/hooks/hooks";
import { logIn, userProfileBegin, userProfileError } from "@rSlices/userSlice";
import { paths } from "@/routes/Routes";

interface Props {
  setRedirectToHome: (redirect: boolean) => void;
}

export default function SignUp({ setRedirectToHome }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [disableSignUpBtn, setDisableSignUpBtn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [formError, setFormError] = useState({
    name: false,
    email: false,
    password: false,
  });
  const { registerUserAsync, loading, error } = useRegisterUser();

  const handleFDataChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setDisableSignUpBtn(false);
    setFormError((pv) => ({ ...pv, [name]: false }));

    setFormData((pv) => ({ ...pv, [name]: value }));
  };

  const onRegister = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (formData.name?.length < 4) {
      setFormError((pv) => ({ ...pv, name: true }));
      return;
    }
    if (!validateEmail(formData.email)) {
      setFormError((pv) => ({ ...pv, email: true }));
      return;
    }
    if (formData.password?.length < 6) {
      setFormError((pv) => ({ ...pv, password: true }));
      return;
    }
    setDisableSignUpBtn(true);
    setRedirectToHome(false);

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
    <Stack component="form" spacing={1} noValidate onSubmit={onRegister}>
      <TextField
        label="Name"
        id={"name"}
        placeholder={"your name"}
        variant="outlined"
        name={"name"}
        value={formData.name}
        onChange={handleFDataChange}
        error={formError.name}
        helperText={formError.name ? "Must be more than 3 chars" : ""}
        size="small"
        required
        inputProps={{ style: { textTransform: "capitalize" } }}
      />
      <TextField
        label="Email"
        id={"email"}
        placeholder="yours@example.com"
        variant="outlined"
        name={"email"}
        type="email"
        value={formData.email}
        onChange={handleFDataChange}
        error={formError.email}
        helperText={formError.email ? "Invalid email format" : ""}
        size="small"
        required
      />
      <TextField
        label="Password"
        id={"password"}
        placeholder={"your password"}
        variant="outlined"
        name={"password"}
        value={formData.password}
        onChange={handleFDataChange}
        error={formError.password}
        helperText={formError.password ? "Must be more than 5 chars" : ""}
        size="small"
        required
        type={showPassword ? "text" : "password"}
        InputProps={{
          endAdornment: formData.password?.length > 0 && (
            <InputAdornment position="end">
              <IconButton onClick={togglePasswordVisibility}>
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Typography variant="caption" color="text.secondary" textAlign={"center"}>
        By signing up, you agree to our terms of service and privacy policy.
      </Typography>
      <Button type="submit" variant="contained" disabled={disableSignUpBtn}>
        {loading ? <CircularProgress size={20} color="inherit" /> : "Sign Up"}
      </Button>
      {error && (
        <Alert severity="error" color="error">
          {error.message}
        </Alert>
      )}
    </Stack>
  );
}
