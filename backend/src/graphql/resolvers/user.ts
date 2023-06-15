import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import * as dotenv from "dotenv";
import qs from "querystring";
import axios from "axios";

import {
  GraphQLContext,
  ILoginUserInput,
  IRegisterUserInput,
  IGetUserAddInput,
  IUpdateUserInput,
  IUser,
} from "../../types/userTypes";
import { gqlError } from "../../utils/funcs";
import {
  validateLatAndLng,
  validateLoginInput,
  validateRegisterInput,
  validateUpdateUser,
} from "../../utils/validators/userValidators";
import checkAuth, {
  generateToken,
  isAdmin,
  isSuperAdmin,
} from "../../utils/checkAuth";
import { CRED_PROVIDER, GOOGLE_PROVIDER } from "../../utils/constants";

dotenv.config();

export default {
  Query: {
    searchUser: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ): Promise<IUser> => {
      const { prisma, req } = context;
      const user = checkAuth(req);

      try {
        const foundUser = await prisma.user.findFirst({
          where: { id },
        });
        if (!foundUser) {
          throw gqlError({ msg: "User not found", code: "BAD_REQUEST" });
        }

        return getUserProps(foundUser);
      } catch (error: any) {
        console.log("search user error", error);
        throw gqlError({ msg: error?.message });
      }
    },
    searchAllUsers: async (
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<IUser[]> => {
      const { prisma, req } = context;
      const user = checkAuth(req);

      try {
        const allUsers = await prisma.user.findMany();
        return allUsers.map((foundUser) => getUserProps(foundUser));
      } catch (error: any) {
        console.log("search all users error", error);
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
      { accessToken }: { accessToken: string },
      context: GraphQLContext
    ): Promise<IUser> => {
      try {
        const { prisma } = context;

        // get token info
        const tokenInfoResp = await axios.post(
          "https://www.googleapis.com/oauth2/v3/tokeninfo",
          qs.stringify({ access_token: accessToken })
        );

        if (tokenInfoResp.status === 200) {
          const { aud, email } = tokenInfoResp.data;
          if (process.env.GOOGLE_CLIENT_ID !== aud)
            throw gqlError({ msg: "Token not verified", code: "FORBIDDEN" });

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
    googleOneTapLogin: async (
      _: any,
      { credential }: { credential: string },
      context: GraphQLContext
    ): Promise<IUser> => {
      const { prisma } = context;
      const decodedToken = jwt.decode(credential);

      try {
        if (typeof decodedToken === "object" && decodedToken !== null) {
          const {
            aud,
            email,
            name,
            picture,
            verified_email: emailVerified,
          } = decodedToken as jwt.JwtPayload;

          if (process.env.GOOGLE_CLIENT_ID !== aud)
            throw gqlError({ msg: "Token not verified", code: "FORBIDDEN" });

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
          throw gqlError({ msg: "Could not decode credentials" });
        }
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
    updateUser: async (
      _: any,
      { id, name, phoneNum, image, address, bio }: IUpdateUserInput,
      context: GraphQLContext
    ): Promise<IUser> => {
      const { prisma, req } = context;
      const user = checkAuth(req);

      if (id !== user.id && !isAdmin(user.roles) && !isSuperAdmin(user.roles)) {
        throw gqlError({
          msg: "Unauthorized user. You cannot update someone else's profile",
          code: "FORBIDDEN",
        });
      }

      try {
        const existingUser = await prisma.user.findUnique({ where: { id } });

        if (!existingUser) {
          throw gqlError({
            msg: "No user found with the given ID",
            code: "BAD_REQUEST",
          });
        }

        const validate = validateUpdateUser({ name, phoneNum, image, bio });
        if (validate.error) throw validate.error;
        const updatedUser = await prisma.user.update({
          where: { id },
          data: {
            ...validate.data,
            address: { ...(existingUser.address as any), ...address },
          },
        });

        return getUserProps(updatedUser, user.token);
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
    getUserAddress: async (
      _: any,
      { id, lat, lng }: IGetUserAddInput,
      context: GraphQLContext
    ): Promise<IUser> => {
      const { prisma, req } = context;
      const user = checkAuth(req);

      if (id !== user.id && !isAdmin(user.roles) && !isSuperAdmin(user.roles)) {
        throw gqlError({
          msg: "Unauthorized user. You cannot update someone else's profile",
          code: "FORBIDDEN",
        });
      }

      try {
        const existingUser = await prisma.user.findUnique({ where: { id } });

        if (!existingUser) {
          throw gqlError({
            msg: "No user found with the given ID",
            code: "BAD_REQUEST",
          });
        }

        const inputErr = validateLatAndLng(lat, lng);
        if (inputErr) throw inputErr;

        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const add = response.data?.address;
        if (add) {
          const address = {
            houseNum: add?.house_number,
            road: add?.road,
            neighbourhood: add?.neighbourhood,
            city: add?.city,
            municipality: add?.county,
            region: add?.state_district,
            province: add?.state,
            postalCode: add?.postcode,
            country: add?.country,
            countryCode: add?.country_code,
            displayName: response.data?.display_name,
            lat,
            lng,
          };

          const updatedUser = await prisma.user.update({
            where: { id },
            data: { address },
          });

          return getUserProps(updatedUser, user.token);
        } else throw gqlError({ msg: "Could not retrieve address details" });
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
  },
  // Subscription:{}
};

const getUserProps = (user: User, token = "") => {
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
    phoneNum: user?.phoneNum,
    address: user?.address,
    bio: user?.bio,
  };
};
