import { ChangeEvent, FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";
import { Stack, TextField, Button } from "@mui/material";

import { ILoginUserData, ILoginUserInput } from "@/graphql/operations/user";
import { validateEmail } from "@/utils/utilFuncs";
import userOps from "@gqlOps/user";

export default function CredentialLogin() {
  const [disableLoginBtn, setDisableLoginBtn] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formError, setFormError] = useState({ email: false, password: false });
  const [loginUser, {}] = useMutation<ILoginUserData, ILoginUserInput>(
    userOps.Mutations.loginUser
  );

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
    if (formData.password?.length < 4) {
      setFormError((pv) => ({ ...pv, password: true }));
      return;
    }
    setDisableLoginBtn(true);

    try {
      const { data } = await loginUser({
        variables: { email: formData.email, password: formData.password },
      });

      console.log("DATA INSIDE LOGIN", data);

      if (!data?.loginUser) throw new Error();
      // const error = data?.loginUser?.error;
      // if (error) throw new Error(error);
    } catch (error) {
      console.log("onSubmit error", error);
    }
  };

  return (
    <Stack
      component="form"
      spacing={1}
      noValidate
      autoComplete="off"
      onSubmit={onLogin}
    >
      <TextField
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
      />
      <TextField
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
      />
      <Button type="submit" variant="contained" disabled={disableLoginBtn}>
        Log In
      </Button>
    </Stack>
  );
}
