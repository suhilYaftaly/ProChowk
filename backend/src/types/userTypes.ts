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
    session?: any; //fix later
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
  createdAt: any;
  updatedAt?: any;
  provider: string;
  roles?: UserRole[] | Prisma.JsonValue;
  phoneNum?: string | null;
  address?: IUserAddress | Prisma.JsonValue;
  bio?: string | null;
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
  lat: string;
  lng: string;
  [key: string]: string | undefined;
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

export interface IUpdateUserInput {
  id: string;
  name?: string;
  phoneNum?: string;
  image?: UserImage;
  address?: IUserAddress;
  bio?: string;
}
export interface IUpdateUserInputData {
  name?: string;
  phoneNum?: string;
  image?: UserImage;
  address?: IUserAddress;
  bio?: string;
}

export interface IGetUserAddInput {
  id: string;
  lat: string;
  lng: string;
}
