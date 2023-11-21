import { ChangeEvent, FormEvent, useState } from "react";
import {
  Stack,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { navigateToOnLogin, validateEmail } from "@utils/utilFuncs";
import { useLoginUser } from "@gqlOps/user";
import { useAppDispatch } from "@utils/hooks/hooks";
import { logIn, userProfileBegin, userProfileError } from "@rSlices/userSlice";
import { paths } from "@routes/Routes";

interface Props {
  setRedirectToHome: (redirect: boolean) => void;
}

export default function CredentialLogin({ setRedirectToHome }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [disableLoginBtn, setDisableLoginBtn] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState({ email: false, password: false });
  const { loginUserAsync, loading, error } = useLoginUser();

  const handleFDataChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setDisableLoginBtn(false);
    setFormError((pv) => ({ ...pv, [name]: false }));
    setFormData((pv) => ({ ...pv, [name]: value }));
  };

  const onLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validateEmail(formData.email)) {
      setFormError((pv) => ({ ...pv, email: true }));
      return;
    }
    if (formData.password?.length < 6) {
      setFormError((pv) => ({ ...pv, password: true }));
      return;
    }
    setDisableLoginBtn(true);
    setRedirectToHome(false);

    dispatch(userProfileBegin());
    loginUserAsync({
      variables: { email: formData.email, password: formData.password },
      onSuccess: (d) => {
        dispatch(logIn(d));
        navigateToOnLogin({ user: d, navigate });
      },
      onError: (err) => dispatch(userProfileError({ message: err?.message })),
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Stack
      component="form"
      noValidate
      onSubmit={onLogin}
      sx={{ textAlign: "center" }}
    >
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
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={togglePasswordVisibility}>
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mt: 2 }}
      />
      <Link
        variant="caption"
        color="text.secondary"
        onClick={() => navigate(paths.resetPassword)}
        sx={{ cursor: "pointer", alignSelf: "flex-end" }}
      >
        Forgot Password?
      </Link>
      <Button
        type="submit"
        variant="contained"
        disabled={disableLoginBtn}
        sx={{ borderRadius: 5, mt: 3 }}
      >
        {loading ? <CircularProgress size={20} color="inherit" /> : "Log In"}
      </Button>
      {error && (
        <Alert severity="error" color="error" sx={{ mt: 2 }}>
          {error.message}
        </Alert>
      )}
    </Stack>
  );
}
