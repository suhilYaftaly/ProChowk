import { PrismaClient } from "@prisma/client";

export interface GraphQLContext {
  req: any;
  prisma: PrismaClient;
  // pubsub
}

//USER
export interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  token?: string;
  createdAt: any;
  updatedAt?: any;
}
export interface IRegisterUserInput {
  name: string;
  password: string;
  confirmPassword: string;
  email: string;
}
export interface ILoginUserInput {
  email: string;
  password: string;
}
