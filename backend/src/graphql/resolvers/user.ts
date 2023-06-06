import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import * as dotenv from "dotenv";
import qs from "querystring";
import axios from "axios";

import {
  GraphQLContext,
  IGoogleLoginInput,
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
import { CRED_PROVIDER, GOOGLE_PROVIDER } from "../../utils/constants";

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
          where: { email: { equals: email, mode: "insensitive" } },
        });
        if (!foundUser) {
          throw gqlError({
            msg: "Email not found",
            code: "BAD_REQUEST",
          });
        }

        return getUserProps(foundUser, "");
      } catch (error: any) {
        console.log("search user error", error);
        throw gqlError({ msg: error?.message });
      }
    },
  },
  Mutation: {
    registerUser: async (
      _: any,
      { name, password, email }: IRegisterUserInput,
      context: GraphQLContext
    ): Promise<IUser> => {
      const { prisma } = context;

      try {
        const inputErr = validateRegisterInput({
          name,
          password,
          // confirmPassword,
          email,
        });
        if (inputErr) throw inputErr;

        const existingUser = await prisma.user.findFirst({
          where: { email: { equals: email, mode: "insensitive" } },
        });
        if (existingUser) {
          throw gqlError({
            msg: "There is already an account registered with this email, Please Log In",
            code: "BAD_USER_INPUT",
          });
        }

        password = await bcrypt.hash(password, 12);
        const newUser = await prisma.user.create({
          data: { name, email, password, provider: CRED_PROVIDER },
        });

        const token = generateToken(newUser);
        return getUserProps(newUser, token);
      } catch (error: any) {
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
          where: { email: { equals: email, mode: "insensitive" } },
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
        return getUserProps(foundUser, token);
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
    googleLogin: async (
      _: any,
      { accessToken }: IGoogleLoginInput,
      context: GraphQLContext
    ): Promise<IUser> => {
      try {
        dotenv.config();
        const { prisma } = context;

        // get token info
        const tokenInfoResp = await axios.post(
          "https://www.googleapis.com/oauth2/v3/tokeninfo",
          qs.stringify({ access_token: accessToken })
        );

        if (tokenInfoResp.status === 200) {
          const { aud, email } = tokenInfoResp.data;
          if (process.env.GOOGLE_CLIENT_ID !== aud)
            gqlError({ msg: "Token not verified", code: "FORBIDDEN" });

          // get user info
          const userInfoResp = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );

          if (userInfoResp.status === 200) {
            const {
              name,
              picture,
              verified_email: emailVerified,
            } = userInfoResp.data;

            const foundUser = await prisma.user.findFirst({
              where: {
                email: { equals: email, mode: "insensitive" },
                provider: GOOGLE_PROVIDER,
              },
            });

            if (!foundUser) {
              const newUser = await prisma.user.create({
                data: {
                  name,
                  email,
                  provider: GOOGLE_PROVIDER,
                  image: { picture },
                  emailVerified,
                },
              });

              const token = generateToken(newUser);
              return getUserProps(newUser, token);
            }

            const token = generateToken(foundUser);
            return getUserProps(foundUser, token);
          } else {
            throw gqlError({
              msg:
                "Failed to fetch user information from google: " +
                userInfoResp.data,
            });
          }
        } else {
          throw gqlError({
            msg:
              "Google access token verification failed: " + tokenInfoResp.data,
          });
        }
      } catch (error: any) {
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
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    process.env.AUTH_SECRET as string
    // { expiresIn: "12h" }
  );

  if (!token)
    throw gqlError({
      msg: "Error generating token",
      code: "UNAUTHENTICATED",
    });

  return token;
};

const getUserProps = (user: User, token: string) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    image: user.image,
    token,
    provider: user.provider,
    roles: user?.roles,
  };
};
