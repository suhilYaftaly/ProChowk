import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, UserType } from "@prisma/client";
import * as dotenv from "dotenv";
import qs from "querystring";
import axios from "axios";

import {
  showInputError,
  gqlError,
  validateEmail,
  validatePhoneNum,
  sendEmail,
  EmailParams,
} from "../../utils/funcs";
import checkAuth, {
  canUserUpdate,
  generateEmailVerificationToken,
  generateUserToken,
  verifyToken,
} from "../../utils/checkAuth";
import {
  GraphQLContext,
  IAddressInput,
  IUserImageInput,
} from "../../types/commonTypes";

dotenv.config();

export default {
  Query: {
    user: async (
      _: any,
      { id }: { id: string },
      context: GraphQLContext
    ): Promise<User> => {
      const { prisma } = context;

      try {
        const foundUser = await prisma.user.findFirst({
          where: { id },
          include: { image: true, address: true },
        });
        if (!foundUser)
          throw gqlError({ msg: "User not found", code: "BAD_REQUEST" });

        return getUserProps(foundUser);
      } catch (error: any) {
        console.log("user query error", error);
        throw gqlError({ msg: error?.message });
      }
    },
    users: async (
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<User[]> => {
      const { prisma } = context;

      try {
        return await prisma.user.findMany({
          include: { image: true, address: true },
        });
      } catch (error: any) {
        console.log("users query error", error);
        throw gqlError({ msg: error?.message });
      }
    },
  },
  Mutation: {
    registerUser: async (
      _: any,
      { name, password, email }: IRegisterUserInput,
      context: GraphQLContext
    ): Promise<User> => {
      const { prisma } = context;

      try {
        const inputErr = validateRegisterI({
          name,
          password,
          email,
        });
        if (inputErr) throw inputErr;

        const existingUser = await prisma.user.findFirst({
          where: { email: { equals: email, mode: "insensitive" } },
        });
        if (existingUser) {
          throw showInputError(
            "There is already an account registered with this email, Please login instead"
          );
        }

        password = await bcrypt.hash(password, 12);
        const newUser = await prisma.user.create({
          data: { name, email, password },
          include: { image: true, address: true },
        });

        const token = generateUserToken(newUser);
        await sendVerificationEmail(newUser);
        return getUserProps(newUser, token);
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
    verifyEmail: async (
      _: any,
      { token }: { token: string },
      context: GraphQLContext
    ): Promise<string> => {
      const { prisma } = context;

      try {
        const verifiedUser = verifyToken(token);
        if (!verifiedUser)
          throw gqlError({
            msg: "Invalid verification token.",
            code: "UNAUTHENTICATED",
          });

        // Mark the email as verified in the database
        const user = await prisma.user.update({
          where: { id: verifiedUser.id },
          data: { emailVerified: true },
        });
        if (user) return generateUserToken(user);
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
    loginUser: async (
      _: any,
      { password, email }: ILoginUserInput,
      context: GraphQLContext
    ): Promise<User> => {
      const { prisma } = context;

      try {
        const inputErr = validateLoginInput({ email, password });
        if (inputErr) throw inputErr;

        const foundUser = await prisma.user.findFirst({
          where: { email: { equals: email, mode: "insensitive" } },
          include: { image: true, address: true },
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

        const token = generateUserToken(foundUser);
        return getUserProps(foundUser, token);
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
    googleLogin: async (
      _: any,
      { accessToken }: { accessToken: string },
      context: GraphQLContext
    ): Promise<User> => {
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
              picture: url,
              verified_email: emailVerified,
            } = userInfoResp.data;

            const foundUser = await prisma.user.findFirst({
              where: {
                email: { equals: email, mode: "insensitive" },
                provider: "Google",
              },
              include: { image: true, address: true },
            });

            if (!foundUser) {
              const newUser = await prisma.user.create({
                data: {
                  name,
                  email,
                  provider: "Google",
                  image: { create: { url } },
                  emailVerified,
                },
                include: { image: true, address: true },
              });

              await sendVerificationEmail(foundUser);
              const token = generateUserToken(newUser);
              return getUserProps(newUser, token);
            }

            const token = generateUserToken(foundUser);
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
    ): Promise<User> => {
      const { prisma } = context;
      const decodedToken = jwt.decode(credential);

      try {
        if (typeof decodedToken === "object" && decodedToken !== null) {
          const {
            aud,
            email,
            name,
            picture: url,
            verified_email: emailVerified,
          } = decodedToken as jwt.JwtPayload;

          if (process.env.GOOGLE_CLIENT_ID !== aud)
            throw gqlError({ msg: "Token not verified", code: "FORBIDDEN" });

          const foundUser = await prisma.user.findFirst({
            where: {
              email: { equals: email, mode: "insensitive" },
              provider: "Google",
            },
            include: { image: true, address: true },
          });

          if (!foundUser) {
            const newUser = await prisma.user.create({
              data: {
                name,
                email,
                provider: "Google",
                image: { create: { url } },
                emailVerified,
              },
              include: { image: true, address: true },
            });

            await sendVerificationEmail(foundUser);
            const token = generateUserToken(newUser);
            return getUserProps(newUser, token);
          }

          const token = generateUserToken(foundUser);
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
      { id, edits }: { id: string; edits: IUpdateUserInput },
      context: GraphQLContext
    ): Promise<User> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);
      canUserUpdate({ id, authUser });
      const { name, phoneNum, image, address, bio, userTypes } = edits;

      try {
        //validations
        const valUDetails = validateUpdateUserI({
          name,
          phoneNum,
          bio,
          userTypes,
        });
        if (valUDetails?.error) throw valUDetails.error;

        const valImg = validateUserImageI(image);
        if (valImg?.error) throw valImg.error;

        const valAddr = validateUserAddressI(address);
        if (valAddr?.error) throw valAddr.error;

        const eUser = await prisma.user.findUnique({
          where: { id },
          include: { image: true, address: true },
        });
        if (!eUser)
          throw gqlError({
            msg: "No user found with the given ID",
            code: "BAD_REQUEST",
          });

        //updates
        const updateData: any = { ...valUDetails.data };

        if (valImg?.image) {
          updateData.image = eUser.image
            ? { update: valImg.image }
            : { create: valImg.image };
        }

        if (valAddr?.address) {
          updateData.address = {
            connectOrCreate: {
              create: valAddr.address,
              where: {
                lat_lng: {
                  lat: valAddr.address.lat,
                  lng: valAddr.address.lng,
                },
              },
            },
          };
        }

        const updatedUser = await prisma.user.update({
          where: { id },
          data: updateData,
          include: { image: true, address: true },
        });

        return getUserProps(updatedUser);
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
    sendVerificationEmail: async (
      _: any,
      { email }: { email: string },
      context: GraphQLContext
    ): Promise<boolean> => {
      const { prisma } = context;

      try {
        //validate email input
        if (!validateEmail(email))
          gqlError({ msg: "Invalid email address", code: "BAD_USER_INPUT" });

        const eUser = await prisma.user.findFirst({
          where: { email: { equals: email, mode: "insensitive" } },
        });
        if (eUser) {
          await sendVerificationEmail(eUser);
          return true;
        } else throw gqlError({ msg: "User Not Found!" });
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
  },
};

const getUserProps = (user: User, token?) =>
  token ? { ...user, token } : user;

/**
 * INTERFACES
 */
interface IRegisterUserInput {
  name: string;
  password: string;
  email: string;
}
interface ILoginUserInput {
  email: string;
  password: string;
}
interface IUpdateUserInput {
  name?: string;
  phoneNum?: string;
  image?: IUserImageInput;
  address?: IAddressInput;
  bio?: string;
  userTypes?: UserType[];
}
interface IValidateUUI {
  name?: string;
  phoneNum?: string;
  bio?: string;
  userTypes?: UserType[];
}

/**
 * HELPER FUNCTIONS
 */
const sendVerificationEmail = async (user: User) => {
  const token = generateEmailVerificationToken(user);
  const baseUrl = process.env.CLIENT_ORIGIN;
  const verificationLink = `${baseUrl}/verify-email?token=${token}`;

  const emailParams: EmailParams = {
    from: {
      email: "noreply@prochowk.com",
      name: "Pro Chowk",
    },
    to: [
      {
        email: user.email,
        name: user.name,
      },
    ],
    subject: "Verify your email address",
    text: `Please verify your email by clicking the link: ${verificationLink}`,
    html: `
      <div style="background-color: #f6f6f6; padding: 20px; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 4px; padding: 20px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center;">
            <img src="${baseUrl}/logo.png" alt="Logo" style="width: 100px;" />
            <h2 style="margin-top: 20px; color: #333333;">Verify your email</h2>
          </div>
          <p style="font-size: 16px; line-height: 1.5; color: #666666; text-align: center;">
            Hello ${user.name}, thank you for signing up. To complete your registration, please click the button below to verify your email.
          </p>
          <div style="text-align: center;">
            <a href="${verificationLink}" style="background-color: #d94f14; color: #ffffff; font-size: 16px; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 20px; display: inline-block;">Verify Email</a>
          </div>
          <p style="font-size: 14px; color: #999999; text-align: center; margin-top: 30px;">
            If you did not sign up for an account, you can ignore this email.
          </p>
        </div>
      </div>
    `,
    variables: [],
  };

  return await sendEmail(emailParams);
};

/**
 * VALIDATORS
 */
const validateUserName = (name: string) => {
  if (name.trim()?.length < 3)
    return showInputError("Name must be more than 3 chars");
  return undefined;
};

const validateRegisterI = ({ name, password, email }: IRegisterUserInput) => {
  validateUserName(name);
  if (!validateEmail(email)) return showInputError("Invalid email address");
  if (password === "") return showInputError("Password must not be empty");

  return undefined;
};

const validateLoginInput = ({ email, password }: ILoginUserInput) => {
  if (!validateEmail(email)) return showInputError("Invalid email address");
  if (password === "") return showInputError("Password must not be empty");

  return undefined;
};

const validateUpdateUserI = ({
  name,
  bio,
  phoneNum,
  userTypes,
}: IValidateUUI) => {
  const data: IValidateUUI = {};

  if (name) {
    const nameErr = validateUserName(name);
    if (nameErr) return { error: nameErr };
    data.name = name;
  }

  if (bio) {
    if (bio.trim()?.length < 10)
      return { error: showInputError("bio must be more than 10 chars") };
    data.bio = bio;
  }

  if (userTypes) {
    if (userTypes?.length < 1)
      return { error: showInputError("User type cannot be empty") };
    data.userTypes = userTypes;
  }

  if (phoneNum) {
    if (!validatePhoneNum(phoneNum))
      return { error: showInputError("Incorrect phone number format") };
    data.phoneNum = phoneNum;
  }

  return { data };
};

const validateUserImageI = (image: IUserImageInput) => {
  const validate = () => {
    if (typeof image !== "object" || image === null) {
      return showInputError("Invalid image format");
    }
    if (!("url" in image)) {
      return showInputError("Image must have a 'url' field");
    }
    if (typeof image.url !== "string" || image.url.trim() === "") {
      return showInputError("Image url must be a non-empty string");
    }

    return undefined;
  };
  if (image) {
    const imageErr = validate();
    if (imageErr) return { error: imageErr };
    return { image };
  }
};

const validateUserAddressI = (address: IAddressInput) => {
  const validate = () => {
    const {
      street,
      county,
      state,
      stateCode,
      city,
      postalCode,
      country,
      countryCode,
      displayName,
      lat,
      lng,
    } = address;

    if (street && street?.trim() === "")
      return showInputError("Street is required");
    if (county && county?.trim() === "")
      return showInputError("County is required");
    if (state && state?.trim() === "")
      return showInputError("State is required");
    if (city && city?.trim() === "") return showInputError("City is required");
    if (stateCode && stateCode?.trim() === "")
      return showInputError("State Code is required");
    if (postalCode && postalCode?.trim() === "")
      return showInputError("Postal code is required");
    if (country && country?.trim() === "")
      return showInputError("Country is required");
    if (countryCode && countryCode?.trim() === "")
      return showInputError("Country code is required");
    if (displayName && displayName?.trim() === "")
      return showInputError("Display name is required");
    if (lat && isNaN(Number(lat)))
      return showInputError("Invalid latitude value");
    if (lng && isNaN(Number(lng)))
      return showInputError("Invalid longitude value");

    return undefined;
  };

  if (address) {
    const addressErr = validate();
    if (addressErr) return { error: addressErr };
    return { address };
  }
};
