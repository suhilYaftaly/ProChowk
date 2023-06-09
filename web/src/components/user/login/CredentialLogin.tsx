import { ChangeEvent, FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";
import {
  Stack,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { validateEmail } from "@utils/utilFuncs";
import userOps, { ILoginUserData, ILoginUserInput } from "@gqlOps/user";
import { useAppDispatch } from "@utils/hooks/hooks";
import { logIn, userProfileBegin, userProfileError } from "@rSlices/userSlice";

export default function CredentialLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [disableLoginBtn, setDisableLoginBtn] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState({ email: false, password: false });
  const [loginUser, { loading, error }] = useMutation<
    ILoginUserData,
    ILoginUserInput
  >(userOps.Mutations.loginUser);

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

    try {
      dispatch(userProfileBegin());
      const { data } = await loginUser({
        variables: { email: formData.email, password: formData.password },
      });
      if (data?.loginUser) {
        dispatch(logIn(data?.loginUser));
        navigate("/");
      } else throw new Error();
    } catch (error: any) {
      dispatch(userProfileError({ message: error?.message }));
    }
  };

  return (
    <Stack component="form" spacing={1} noValidate onSubmit={onLogin}>
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
        type="password"
        value={formData.password}
        onChange={handleFDataChange}
        error={formError.password}
        helperText={formError.password ? "Must be more than 5 chars" : ""}
        size="small"
        required
      />
      <Link
        component="button"
        variant="caption"
        color="text.secondary"
        onClick={() => {
          console.info("Don't remember your password? (TODO)");
        }}
      >
        Don't remember your password?
      </Link>
      <Button type="submit" variant="contained" disabled={disableLoginBtn}>
        {loading ? <CircularProgress size={20} /> : "Log In"}
      </Button>
      {error && (
        <Alert severity="error" color="error">
          {error.message}
        </Alert>
      )}
    </Stack>
  );
}
