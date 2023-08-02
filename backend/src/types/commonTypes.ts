import {
  Address,
  Budget,
  Job,
  JobImage,
  License,
  PrismaClient,
  Skill,
  UserImage,
} from "@prisma/client";
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

export type IUserImageInput = Omit<UserImage, "createdAt" | "updatedAt">;
export type IAddressInput = Omit<Address, "id" | "createdAt" | "updatedAt">;
export type ISkillInput = Pick<Skill, "label">;
export type ILicenseInput = Omit<
  License,
  "id" | "createdAt" | "updatedAt" | "contractorId"
>;

type IImageInput = Omit<
  JobImage,
  "id" | "createdAt" | "updatedAt" | "job" | "jobId"
>;
type IBudgetInput = Omit<Budget, "id" | "createdAt" | "updatedAt">;
export type IJobInput = Omit<
  Job,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "user"
  | "address"
  | "skills"
  | "images"
  | "budget"
> & {
  address: IAddressInput;
  skills: ISkillInput[];
  images: IImageInput[];
  budget: IBudgetInput;
};
