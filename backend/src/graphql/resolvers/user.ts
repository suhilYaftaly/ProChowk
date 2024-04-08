import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, UserType } from "@prisma/client";
import * as dotenv from "dotenv";
import qs from "querystring";
import axios from "axios";
import { GraphQLResolveInfo } from "graphql";

import {
  showInputError,
  gqlError,
  validateEmail,
  isE164PhoneNumber,
  sendEmail,
  EmailParams,
  generateEmailTemplate,
  ifr,
} from "../../utils/funcs";
import checkAuth, {
  canUserUpdate,
  generateEmailToken,
  generatePasswordToken,
  generateRefreshToken,
  generateUserToken,
  verifyToken,
} from "../../middlewares/checkAuth";
import {
  GQLContext,
  IAddressInput,
  ISkillInput,
  IUserImageInput,
} from "../../types/commonTypes";
import { logger } from "../../middlewares/logger/logger";
import { appName, appNamePascalCase } from "../../constants/constants";

dotenv.config();

const googleCliIdWeb = process.env.GOOGLE_CLIENT_ID;
const googleCliIdAndroid = process.env.GOOGLE_CLIENT_ID_ANDROID;

export default {
  Query: {
    user: async (
      _: any,
      { id }: { id: string },
      context: GQLContext,
      info: GraphQLResolveInfo
    ): Promise<User> => {
      const { prisma } = context;

      const foundUser = await prisma.user.findFirst({
        where: { id },
        include: {
          address: ifr(info, "address"),
          image: ifr(info, "image"),
        },
      });
      if (!foundUser)
        throw gqlError({ msg: "User not found", code: "BAD_REQUEST" });

      return foundUser;
    },
    users: async (
      _: any,
      __: any,
      context: GQLContext,
      info: GraphQLResolveInfo
    ): Promise<User[]> => {
      const { prisma } = context;

      return await prisma.user.findMany({
        include: { address: ifr(info, "address"), image: ifr(info, "image") },
      });
    },
  },
  Mutation: {
    registerUser: async (
      _: any,
      { name, password, email }: IRegisterUserInput,
      context: GQLContext,
      info: GraphQLResolveInfo
    ): Promise<User> => {
      const { prisma, userAgent } = context;

      const inputErr = validateRegisterI({
        name,
        password,
        email,
      });
      if (inputErr) throw inputErr;

      const foundUser = await prisma.user.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
      });
      if (foundUser) {
        throw showInputError(
          "There is already an account registered with this email, Please login instead"
        );
      }

      password = await bcrypt.hash(password, 12);
      const newUser = await prisma.user.create({
        data: { name, email, password },
        include: { address: ifr(info, "address"), image: ifr(info, "image") },
      });

      const accessToken = generateUserToken(newUser);
      await sendVerificationEmail(newUser);
      const refreshToken = await createRefreshToken(prisma, newUser, userAgent);
      return getUserProps(newUser, accessToken, refreshToken);
    },
    loginUser: async (
      _: any,
      { password, email }: ILoginUserInput,
      context: GQLContext,
      info: GraphQLResolveInfo
    ): Promise<User> => {
      const { prisma, userAgent } = context;

      const inputErr = validateLoginInput({ email, password });
      if (inputErr) throw inputErr;

      const foundUser = await prisma.user.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
        include: { address: ifr(info, "address"), image: ifr(info, "image") },
      });
      if (!foundUser || !foundUser.password) {
        throw gqlError({
          msg: "Invalid email or password",
          code: "BAD_REQUEST",
        });
      }

      const matchPass = await bcrypt.compare(
        password,
        foundUser.password as string
      );
      if (!matchPass) {
        throw gqlError({
          msg: "Invalid email or password",
          code: "BAD_REQUEST",
        });
      }

      const accessToken = generateUserToken(foundUser);
      const refreshToken = await updateRefreshToken(
        prisma,
        foundUser,
        userAgent
      );

      logger.info("logged in", {
        user: { name: foundUser.name, email: foundUser.email },
      });
      return getUserProps(foundUser, accessToken, refreshToken);
    },
    googleLogin: async (
      _: any,
      {
        accessToken,
        client = "Web",
      }: { accessToken: string; client: GoogleClientType },
      context: GQLContext
    ): Promise<User> => {
      const { prisma, userAgent } = context;

      // get token info
      const tokenInfoResp = await axios.post(
        "https://www.googleapis.com/oauth2/v3/tokeninfo",
        qs.stringify({ access_token: accessToken })
      );

      if (tokenInfoResp.status === 200) {
        const { aud, email } = tokenInfoResp.data;
        validateGoogleClientId(client, aud);

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

          return createOrLoginWithGoogle({
            prisma,
            email,
            url,
            emailVerified,
            name,
            userAgent,
          });
        } else {
          throw gqlError({
            msg:
              "Failed to fetch user information from google: " +
              userInfoResp.data,
          });
        }
      } else {
        throw gqlError({ msg: "Verification failed: " + tokenInfoResp.data });
      }
    },
    googleOneTapLogin: async (
      _: any,
      {
        credential,
        client = "Web",
      }: { credential: string; client: GoogleClientType },
      context: GQLContext
    ): Promise<User> => {
      const { prisma, userAgent } = context;
      const decodedToken = jwt.decode(credential);

      if (typeof decodedToken === "object" && decodedToken !== null) {
        const {
          aud,
          email,
          name,
          picture: url,
          verified_email: emailVerified,
        } = decodedToken as jwt.JwtPayload;

        if (!aud || typeof aud !== "string")
          throw gqlError({ msg: "Google Auth Failed" });
        validateGoogleClientId(client, aud);

        return createOrLoginWithGoogle({
          prisma,
          email,
          url,
          emailVerified,
          name,
          userAgent,
        });
      } else throw gqlError({ msg: "Could not decode credentials" });
    },
    updateUser: async (
      _: any,
      { id, edits }: { id: string; edits: IUpdateUserInput },
      context: GQLContext,
      info: GraphQLResolveInfo
    ): Promise<User> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);
      canUserUpdate({ id, authUser, checkEmail: false });
      const { image, address, userTypes, skills } = edits;

      //validate and create update data
      const constructedData = constructUpdateData(edits);

      const eUser = await prisma.user.findUnique({
        where: { id },
        include: { image: true, contractor: true },
      });
      if (!eUser)
        throw gqlError({
          msg: "No user found with the given ID",
          code: "BAD_REQUEST",
        });

      //reconstruct to manage for more complex queries
      const recoData: any = { ...constructedData };

      if (image) {
        recoData.image = eUser.image ? { update: image } : { create: image };
      }

      if (address) {
        recoData.address = {
          connectOrCreate: {
            create: address,
            where: {
              lat_lng: { lat: address.lat, lng: address.lng },
            },
          },
        };
      }

      //create contractor profile
      if (!eUser.contractor && userTypes?.includes("contractor")) {
        if (skills && skills?.length > 0) {
          const skillsOps = skills.map((skill) => ({
            where: { label: skill.label },
            create: skill,
          }));
          recoData.contractor = {
            create: { skills: { connectOrCreate: skillsOps } },
          };
        } else recoData.contractor = { create: {} };
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: recoData,
        include: { address: ifr(info, "address"), image: ifr(info, "image") },
      });

      return updatedUser;
    },
    sendVerificationEmail: async (
      _: any,
      { email }: { email: string },
      context: GQLContext
    ): Promise<boolean> => {
      const { prisma } = context;

      //validate email input
      if (!validateEmail(email))
        gqlError({ msg: "Invalid email format", code: "BAD_USER_INPUT" });

      const user = await prisma.user.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
      });

      //if user not found then just return true for security reasons
      if (!user) {
        logger.warn("User Not found when sendVerificationEmail()", {
          emailInput: email,
        });
        return true;
      }
      await sendVerificationEmail(user);
      return true;
    },
    verifyEmail: async (
      _: any,
      { token }: { token: string },
      context: GQLContext
    ): Promise<string> => {
      const { prisma } = context;

      const verifiedUser = verifyToken({ token, type: "email" });

      // Mark the email as verified in the database
      const user = await prisma.user.update({
        where: { id: verifiedUser.id },
        data: { emailVerified: true },
      });
      if (!user) throw gqlError({ msg: "Error updating user!" });
      return generateUserToken(user);
    },
    requestPasswordReset: async (
      _: any,
      { email }: { email: string },
      context: GQLContext
    ): Promise<boolean> => {
      const { prisma } = context;

      //validate email input
      if (!validateEmail(email))
        throw gqlError({
          msg: "Invalid email format!",
          code: "BAD_USER_INPUT",
        });

      const user = await prisma.user.findFirst({
        where: { email: { equals: email, mode: "insensitive" } },
      });

      //if user not found then just return true for security reasons
      if (!user) {
        logger.warn("User Not found when requestPasswordReset()", {
          emailInput: email,
        });
        return true;
      }

      //if provider is not credentials then just return true for security reasons
      if (user.provider !== "Credentials") {
        logger.warn("Wrong provider when requestPasswordReset()", { user });
        return true;
      }
      await requestPasswordReset(user);
      return true;
    },
    resetPassword: async (
      _: any,
      { token, newPassword }: { token: string; newPassword: string },
      context: GQLContext,
      info: GraphQLResolveInfo
    ): Promise<User> => {
      const { prisma, userAgent } = context;

      const user = verifyToken({ token, type: "password" });

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
        include: { address: ifr(info, "address"), image: ifr(info, "image") },
      });
      if (updatedUser) {
        const token = generateUserToken(updatedUser);
        const refreshToken = await updateRefreshToken(
          prisma,
          updatedUser,
          userAgent
        );
        logger.info("resetted password and logged in", {
          user: { name: updatedUser.name, email: updatedUser.email },
        });
        return getUserProps(updatedUser, token, refreshToken);
      } else throw gqlError({ msg: "User update failed. Please try again." });
    },
    validateRefreshToken: async (
      _: any,
      { refreshToken }: { refreshToken: string },
      context: GQLContext
    ): Promise<{ accessToken: string; refreshToken: string }> => {
      const { prisma, userAgent } = context;
      const decoded = verifyToken({ token: refreshToken, type: "" });

      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
      });

      if (!storedToken) {
        throw gqlError({
          msg: "Invalid refresh token.",
          code: "UNAUTHENTICATED",
          type: "skipLogging",
        });
      }

      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) throw gqlError({ msg: "Invalid User!" });
      const newAccessToken = generateUserToken(user);
      const newRefreshToken = await updateRefreshToken(prisma, user, userAgent);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    },
  },
};

const getUserProps = (user: User, token: string, refreshToken: string) => ({
  ...user,
  token,
  refreshToken,
});

/**
 * HELPER FUNCTIONS
 */
const sendVerificationEmail = async (user: User): Promise<any> => {
  const token = generateEmailToken(user);
  const baseUrl = process.env.CLIENT_ORIGIN;
  const verificationLink = `${baseUrl}/verify-email?token=${token}`;

  const html = generateEmailTemplate({
    subject: "Verify your email",
    message: `Hello ${user.name}, thank you for signing up. To complete your registration, please click the button below to verify your email.`,
    buttonText: "VERIFY EMAIL",
    buttonLink: verificationLink,
  });

  const params: EmailParams = {
    from: { email: `noreply@${appName}.com`, name: appNamePascalCase },
    to: [{ email: user.email, name: user.name }],
    subject: "Verify your email address",
    text: `Please verify your email by clicking the link: ${verificationLink}`,
    html,
    variables: [],
  };

  return await sendEmail({
    params,
    onSuccess: () =>
      logger.info(`Email Verification Requested for ${user.email}`),
  });
};

const requestPasswordReset = async (user: User): Promise<any> => {
  const token = generatePasswordToken(user);
  const resetLink = `${process.env.CLIENT_ORIGIN}/reset-password?token=${token}`;

  const html = generateEmailTemplate({
    subject: "Password Reset Request",
    message: `Hello ${user.name}, we received a request to reset your password. Click the button below to proceed.`,
    buttonText: "RESET PASSWORD",
    buttonLink: resetLink,
  });

  const params: EmailParams = {
    from: { email: `noreply@${appName}.com`, name: appNamePascalCase },
    to: [{ email: user.email, name: user.name }],
    subject: "Password Reset Request",
    text: `You have requested a password reset. Click the following link to reset your password: ${resetLink}`,
    html,
    variables: [],
  };

  return await sendEmail({
    params,
    onSuccess: () => logger.info(`Password Reset Requested for ${user.email}`),
  });
};

const updateRefreshToken = async (
  prisma: GQLContext["prisma"],
  user: User,
  userAgent: string
) => {
  const { refreshToken, expiresAt } = generateRefreshToken({ userId: user.id });

  // Handle existing refreshTokens
  await prisma.refreshToken.deleteMany({
    where: { userId: user.id, userAgent },
  });
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: expiresAt,
      userAgent,
    },
  });

  return refreshToken;
};
const createRefreshToken = async (
  prisma: GQLContext["prisma"],
  user: User,
  userAgent: string
) => {
  const { refreshToken, expiresAt } = generateRefreshToken({ userId: user.id });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: expiresAt,
      userAgent,
    },
  });
  return refreshToken;
};

const validateGoogleClientId = (client: GoogleClientType, aud: string) => {
  switch (client) {
    case "Android":
      if (googleCliIdAndroid !== aud) {
        throw gqlError({ msg: "Token not verified", code: "FORBIDDEN" });
      }
      break;
    default:
      if (googleCliIdWeb !== aud) {
        throw gqlError({ msg: "Token not verified", code: "FORBIDDEN" });
      }
      break;
  }
};

interface ICreateOrLoginWithG {
  prisma: GQLContext["prisma"];
  email: string;
  url: string;
  emailVerified: boolean;
  name: string;
  userAgent: string;
}
const createOrLoginWithGoogle = async ({
  prisma,
  email,
  url,
  emailVerified,
  name,
  userAgent,
}: ICreateOrLoginWithG) => {
  const foundUser = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    include: { image: true, address: true },
  });

  if (foundUser && foundUser?.provider !== "Google")
    throw showInputError(
      "There is already an account registered with this email, Please login instead"
    );

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

    if (!emailVerified) await sendVerificationEmail(newUser);
    const token = generateUserToken(newUser);
    const refreshToken = await createRefreshToken(prisma, newUser, userAgent);
    logger.info("registered with google", {
      user: { name: newUser.name, email: newUser.email },
    });
    return getUserProps(newUser, token, refreshToken);
  }

  logger.info("logged in with google", {
    user: { name: foundUser.name, email: foundUser.email },
  });
  const token = generateUserToken(foundUser);
  const refreshToken = await updateRefreshToken(prisma, foundUser, userAgent);
  return getUserProps(foundUser, token, refreshToken);
};

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
  skills?: ISkillInput[];
}
type GoogleClientType = "Web" | "Android" | "IOS";

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
  if (password?.length < 7)
    return showInputError("Password must be more than 8 chars");

  return undefined;
};

const validateLoginInput = ({ email, password }: ILoginUserInput) => {
  if (!validateEmail(email)) return showInputError("Invalid email address");
  if (password === "") return showInputError("Password must not be empty");

  return undefined;
};

/**construct and validate user update data */
const constructUpdateData = ({
  name,
  phoneNum,
  address,
  bio,
  userTypes,
  image,
}: IUpdateUserInput) => {
  const dataToCreate: IUpdateUserInput = {};
  if (name) {
    const nameErr = validateUserName(name);
    if (nameErr) throw nameErr;
    dataToCreate.name = name;
  }

  if (userTypes) {
    if (userTypes?.length < 1)
      throw showInputError("User type cannot be empty");

    //if client is missing from userTypes then auto add it
    if (!userTypes?.includes("client")) {
      dataToCreate.userTypes = ["client", ...userTypes];
    } else dataToCreate.userTypes = userTypes;
  }

  if (phoneNum) {
    if (!isE164PhoneNumber(phoneNum))
      throw showInputError("Incorrect phone number format");
    dataToCreate.phoneNum = phoneNum;
  }

  if (bio) dataToCreate.bio = bio;

  if (address) {
    const addressErr = addressHasError(address);
    if (addressErr) throw addressErr;
    dataToCreate.address = address;
  }

  if (image) {
    const imageErr = imageHasError(image);
    if (imageErr) throw imageErr;
    dataToCreate.image = image;
  }

  return dataToCreate;
};

const imageHasError = (image: IUserImageInput) => {
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

const addressHasError = (address: IAddressInput) => {
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
  if (state && state?.trim() === "") return showInputError("State is required");
  if (city?.trim() === "") return showInputError("City is required");
  if (stateCode && stateCode?.trim() === "")
    return showInputError("State Code is required");
  if (postalCode?.trim() === "")
    return showInputError("Postal code is required");
  if (country?.trim() === "") return showInputError("Country is required");
  if (countryCode && countryCode?.trim() === "")
    return showInputError("Country code is required");
  if (displayName && displayName?.trim() === "")
    return showInputError("Display name is required");
  if (isNaN(Number(lat))) return showInputError("Invalid latitude value");
  if (isNaN(Number(lng))) return showInputError("Invalid longitude value");

  return undefined;
};
