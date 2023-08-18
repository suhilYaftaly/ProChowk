import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { Role, User } from "@prisma/client";

import { gqlError } from "./funcs";

interface ISignedProps {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  roles?: Role[];
  iat?: number;
  exp?: number;
  token?: string;
}

dotenv.config();
export default (req: any): ISignedProps => {
  const authHeader = req?.headers?.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")?.[1];
    if (token) {
      try {
        const user = verifyToken(token);
        return { ...user, token };
      } catch (error: any) {
        console.log("Invalid/Expired token", error);
        throw gqlError({ msg: error?.message, code: "UNAUTHENTICATED" });
      }
    }
    throw gqlError({
      msg: "Authentication token must be 'Bearer [token]'",
      code: "BAD_REQUEST",
    });
  }
  throw gqlError({
    msg: "Authorization header must be provided",
    code: "BAD_REQUEST",
  });
};

const generateToken = (user: User, expiresIn = "7d") => {
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      emailVerified: user.emailVerified,
    } as ISignedProps,
    process.env.AUTH_SECRET as string,
    { expiresIn }
  );

  if (!token)
    throw gqlError({
      msg: "Error generating token",
      code: "UNAUTHENTICATED",
    });

  return token;
};
export const generateUserToken = (user: User) => generateToken(user);
export const generateEmailVerificationToken = (user: User) =>
  generateToken(user, "7d");

export const verifyToken = (token: string) =>
  jwt.verify(token, process.env.AUTH_SECRET) as ISignedProps;

export const isSuperAdmin = (roles: Role[] | undefined) =>
  roles?.includes("superAdmin");
export const isAdmin = (roles: Role[] | undefined) => roles?.includes("admin");

interface ICanUserUpdate {
  id: string;
  authUser: ISignedProps;
}
export const canUserUpdate = ({ id, authUser }: ICanUserUpdate) => {
  try {
    if (
      id !== authUser.id &&
      !isAdmin(authUser.roles) &&
      !isSuperAdmin(authUser.roles)
    ) {
      throw gqlError({
        msg: "Unauthorized User. You cannot update someone else's account",
        code: "FORBIDDEN",
      });
    }

    //verify email
    if (!authUser.emailVerified) {
      throw gqlError({
        msg: "Unverified email. Please verify your email.",
        code: "FORBIDDEN",
      });
    }
  } catch (error) {
    throw gqlError({ msg: error?.message });
  }
};
