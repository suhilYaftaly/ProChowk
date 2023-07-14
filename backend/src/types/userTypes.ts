import { Prisma, PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { Context } from "graphql-ws/lib/server";

//server configs
export interface GraphQLContext {
  req: any;
  prisma: PrismaClient;
  pubsub: PubSub;
}
export interface SubsciptionContext extends Context {
  connectionParams: {
    session?: any; //TODO: fix later
  };
}

//USER
export interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: UserImage;
  token?: string;
  createdAt: string | any;
  updatedAt?: string | any;
  provider: string;
  roles?: UserRole[] | Prisma.JsonValue;
  phoneNum?: string | null;
  address?: IUserAddress | Prisma.JsonValue;
  bio?: string | null;
  userType?: UserType[] | Prisma.JsonValue;
}
export type UserRole = "admin" | "superAdmin";
export type UserImage =
  | { picture: string; name?: string; size?: number; type?: string }
  | Prisma.JsonValue;
export interface IUserAddress {
  houseNum: string;
  road: string;
  neighbourhood: string;
  city: string;
  municipality: string;
  region: string;
  province: string;
  postalCode: string;
  country: string;
  countryCode: string;
  displayName: string;
  lat: number;
  lng: number;
  [key: string]: string | any | undefined;
}

export interface IRegisterUserInput {
  name: string;
  password: string;
  // confirmPassword: string;
  email: string;
}

export interface ILoginUserInput {
  email: string;
  password: string;
}

type UserType = "client" | "contractor";
export interface IUpdateUserInput {
  id: string;
  name?: string;
  phoneNum?: string;
  image?: UserImage;
  address?: IUserAddress;
  bio?: string;
  userType?: UserType;
}
export interface IUpdateUserInputData {
  name?: string;
  phoneNum?: string;
  image?: UserImage;
  address?: IUserAddress;
  bio?: string;
  userType?: UserType;
  existingUserType?: UserType[] | Prisma.JsonValue;
}
export interface IUpdateUserValidationData {
  name?: string;
  phoneNum?: string;
  image?: UserImage;
  address?: IUserAddress;
  bio?: string;
  userType?: UserType[];
  existingUserType?: UserType[] | Prisma.JsonValue;
}

export interface IGetUserAddInput {
  id: string;
  lat: number;
  lng: number;
}
