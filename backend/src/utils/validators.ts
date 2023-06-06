import { gqlError, validateEmail } from "./funcs";
import { ILoginUserInput, IRegisterUserInput } from "./types";

export const validateRegisterInput = ({
  name,
  password,
  // confirmPassword,
  email,
}: IRegisterUserInput) => {
  const getErr = (msg: string) => gqlError({ msg, code: "BAD_USER_INPUT" });

  if (name.trim() === "") return getErr("Name must not be empty");
  if (!validateEmail(email)) return getErr("Invalid email address");
  if (password === "") return getErr("Password must not be empty");
  // if (password !== confirmPassword) return getErr("Password must match");

  return undefined;
};

export const validateLoginInput = ({ email, password }: ILoginUserInput) => {
  const getErr = (msg: string) => gqlError({ msg, code: "BAD_USER_INPUT" });

  if (!validateEmail(email)) return getErr("Invalid email address");
  if (password === "") return getErr("Password must not be empty");

  return undefined;
};
