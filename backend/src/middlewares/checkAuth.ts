import * as dotenv from "dotenv";
import jwt, { SignOptions } from "jsonwebtoken";
import { Role, User } from "@prisma/client";

import { gqlError } from "../utils/funcs";

export interface ISignedProps {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  roles?: Role[];
  iat?: number;
  exp?: number;
  token?: string;
  type: TokenType;
}

dotenv.config();
export default (req: any): ISignedProps => {
  const authHeader = req?.headers?.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")?.[1];
    if (token) {
      try {
        const user = verifyToken({ token });
        return { ...user, token };
      } catch (error: any) {
        console.log("Invalid/Expired token", error);
        throw gqlError({ msg: error?.message, code: "UNAUTHENTICATED" });
      }
    }
    throw gqlError({
      msg: "Authentication token must be 'Bearer [token]'",
      code: "UNAUTHENTICATED",
    });
  }
  throw gqlError({
    msg: "Authorization header must be provided",
    code: "UNAUTHENTICATED",
  });
};

type TokenType = "session" | "email" | "password" | "";
interface IGenerateToken {
  user: User;
  expiresIn?: SignOptions["expiresIn"];
  type?: TokenType;
}
const generateToken = ({
  user,
  expiresIn = "1h",
  type = "session",
}: IGenerateToken) => {
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles,
      emailVerified: user.emailVerified,
      type,
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

interface IGenerateRefreshToken {
  userId: string;
  expiresIn?: SignOptions["expiresIn"];
}
interface RefreshTokenData {
  refreshToken: string;
  expiresAt: Date;
}
export const generateRefreshToken = ({
  userId,
  expiresIn = "30d",
}: IGenerateRefreshToken): RefreshTokenData => {
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.AUTH_SECRET as string,
    { expiresIn }
  );

  if (!refreshToken) {
    throw gqlError({
      msg: "Error generating token",
      code: "UNAUTHENTICATED",
    });
  }

  // Decode the token to get the 'exp' claim
  const decoded = jwt.decode(refreshToken);
  if (!decoded || typeof decoded !== "object" || !decoded.exp) {
    throw new Error("Invalid token");
  }
  const expiresAt = new Date(decoded?.exp * 1000);

  return { refreshToken, expiresAt };
};

export const generateUserToken = (user: User) => generateToken({ user });
export const generateEmailToken = (user: User) =>
  generateToken({ user, expiresIn: "1d", type: "email" });
export const generatePasswordToken = (user: User) =>
  generateToken({ user, expiresIn: "1h", type: "password" });

interface IVerifyToken {
  token: string;
  /**pass empty to skip type checking @default "session" */
  type?: TokenType;
}
export const verifyToken = ({ token, type = "session" }: IVerifyToken) => {
  try {
    const results = jwt.verify(
      token,
      process.env.AUTH_SECRET || ""
    ) as ISignedProps;
    if (!results) {
      throw gqlError({ msg: "Invalid token", code: "UNAUTHENTICATED" });
    }
    if (type && type !== results.type)
      throw gqlError({ msg: "incorrect token type." });

    return results;
  } catch (error: any) {
    if (error?.name === "TokenExpiredError")
      switch (type) {
        case "session":
          throw gqlError({
            msg: "Your Session has Expired, Please Login again!",
            code: "UNAUTHENTICATED",
          });
        case "password":
          throw gqlError({
            msg: "Link expired. Please resent a new link to reset password.",
            code: "UNAUTHENTICATED",
          });
        case "email":
          throw gqlError({
            msg: "Link expired. Please resent a new link to verify your email.",
            code: "UNAUTHENTICATED",
          });
        case "":
          throw gqlError({ msg: "Token expired", code: "UNAUTHENTICATED" });
        default:
          throw gqlError({ msg: error?.message, code: "UNAUTHENTICATED" });
      }
    else {
      // other errors
      throw gqlError({ msg: error?.message, code: "UNAUTHENTICATED" });
    }
  }
};

export const isSuperAdmin = (roles: Role[] | undefined) =>
  roles?.includes("superAdmin") || false;
export const isAdmin = (roles: Role[] | undefined): boolean =>
  roles?.includes("admin") || roles?.includes("superAdmin") || false;
export const isDeveloper = (roles: Role[] | undefined): boolean =>
  roles?.includes("dev") ||
  roles?.includes("admin") ||
  roles?.includes("superAdmin") ||
  false;

interface ICanUserUpdate {
  id: string;
  authUser: ISignedProps;
  checkEmail?: boolean;
  /**@default "Unauthorized User. You cannot update someone else's account" */
  message?: string;
}
export const canUserUpdate = ({
  id,
  authUser,
  checkEmail = true,
  message = "Unauthorized User. You cannot update someone else's account",
}: ICanUserUpdate) => {
  // if (id !== authUser.id && !isSuperAdmin(authUser.roles)) {
  if (id !== authUser.id) {
    throw gqlError({ msg: message, code: "FORBIDDEN" });
  }

  if (checkEmail) {
    //verify email
    if (!authUser.emailVerified) {
      throw gqlError({
        msg: "Unverified email. Please verify your email.",
        code: "FORBIDDEN",
      });
    }
  }
};
