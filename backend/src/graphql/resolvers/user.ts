import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import * as dotenv from "dotenv";

import {
  GraphQLContext,
  ILoginUserInput,
  IRegisterUserInput,
  IUser,
} from "../../utils/types";
import { gqlError } from "../../utils/funcs";
import {
  validateLoginInput,
  validateRegisterInput,
} from "../../utils/validators";
import checkAuth from "../../utils/checkAuth";

export default {
  Query: {
    searchUser: async (
      _: any,
      { email }: any,
      context: GraphQLContext
    ): Promise<IUser> => {
      const { prisma, req } = context;
      const user = checkAuth(req);
      console.log("USER TOKEN", user);

      try {
        const foundUser = await prisma.user.findFirst({
          where: { email: { contains: email, mode: "insensitive" } },
        });
        if (!foundUser) {
          throw gqlError({
            msg: "Email not found",
            code: "BAD_REQUEST",
          });
        }

        return {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          emailVerified: foundUser.emailVerified,
          createdAt: foundUser.createdAt,
          updatedAt: foundUser.updatedAt,
          image: foundUser.image,
        };
      } catch (error: any) {
        console.log("search user error", error);
        throw gqlError({ msg: error?.message });
      }
    },
  },
  Mutation: {
    registerUser: async (
      _: any,
      { name, password, confirmPassword, email }: IRegisterUserInput,
      context: GraphQLContext
    ): Promise<IUser> => {
      const { prisma } = context;

      try {
        const inputErr = validateRegisterInput({
          name,
          password,
          confirmPassword,
          email,
        });
        if (inputErr) throw inputErr;

        const existingUser = await prisma.user.findFirst({
          where: { email: { contains: email, mode: "insensitive" } },
        });
        if (existingUser) {
          throw gqlError({
            msg: "There is already an account registered with this email, Please sign in",
            code: "BAD_USER_INPUT",
          });
        }

        password = await bcrypt.hash(password, 12);
        const newUser = await prisma.user.create({
          data: { name, email, password },
        });

        const token = generateToken(newUser);
        if (!token)
          throw gqlError({
            msg: "Error generating token",
            code: "UNAUTHENTICATED",
          });

        return {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          emailVerified: newUser.emailVerified,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
          image: newUser.image,
          token,
        };
      } catch (error: any) {
        console.log("Register user error", error);
        throw gqlError({ msg: error?.message });
      }
    },
    loginUser: async (
      _: any,
      { password, email }: ILoginUserInput,
      context: GraphQLContext
    ): Promise<IUser> => {
      const { prisma } = context;

      try {
        const inputErr = validateLoginInput({ email, password });
        if (inputErr) throw inputErr;

        const foundUser = await prisma.user.findFirst({
          where: { email: { contains: email, mode: "insensitive" } },
        });
        if (!foundUser) {
          throw gqlError({
            msg: "Incorrect email or password",
            code: "BAD_REQUEST",
          });
        }

        const matchPass = await bcrypt.compare(
          password,
          foundUser.password as string
        );
        if (!matchPass) {
          throw gqlError({
            msg: "Incorrect email or password",
            code: "BAD_REQUEST",
          });
        }

        const token = generateToken(foundUser);
        if (!token)
          throw gqlError({
            msg: "Error generating token",
            code: "UNAUTHENTICATED",
          });

        return {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          emailVerified: foundUser.emailVerified,
          createdAt: foundUser.createdAt,
          updatedAt: foundUser.updatedAt,
          image: foundUser.image,
          token,
        };
      } catch (error: any) {
        console.log("Login user error", error);
        throw gqlError({ msg: error?.message });
      }
    },

    // createUsername: async (
    //   _: any,
    //   args: { username: string },
    //   context: GraphQLContext
    // ): Promise<CreateUsernameResponse> => {
    //   const { username } = args;
    //   const { prisma, session } = context;

    //   if (!session?.user) return createErrorObj({ error: "Not Authorized" });

    //   const { email } = session.user;

    //   try {
    //     const existingUser = await prisma.user.findUnique({
    //       where: { username },
    //     });
    //     if (existingUser)
    //       return createErrorObj({
    //         error: "Username already taken, Try another.",
    //       });

    //     const updateUser = await prisma.user.update({
    //       where: { email },
    //       data: { username },
    //     });
    //     console.log("updateUser", updateUser);

    //     return { success: true };
    //   } catch (error: any) {
    //     console.log("CreateUsername error", error);
    //     return createErrorObj({ error: error?.message });
    //   }
    // },
  },
  // Subscription:{}
};

const generateToken = (user: User) => {
  dotenv.config();

  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    process.env.AUTH_SECRET as string,
    { expiresIn: "12h" }
  );
};
