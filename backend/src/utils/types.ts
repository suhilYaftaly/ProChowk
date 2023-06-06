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
  image?: { picture: string } | Prisma.JsonValue;
  token?: string;
  createdAt: any;
  updatedAt?: any;
  provider: string;
  roles?: UserRole[] | Prisma.JsonValue;
}
type UserRole = "admin" | "superAdmin";
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
export interface IGoogleLoginInput {
  accessToken: string;
}
export interface IGoogleOneTapLoginInput {
  credential: string;
}
