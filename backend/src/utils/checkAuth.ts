import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { gqlError } from "./funcs";

export default (req: any) => {
  dotenv.config();
  const authHeader = req?.headers?.authorization;
  if (authHeader) {
    const token = authHeader.split("Bearer ")?.[1];
    if (token) {
      try {
        const user = jwt.verify(token, process.env.AUTH_SECRET as string);
        return user;
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
