import {
  Address,
  Budget,
  Job,
  JobImage,
  License,
  Message,
  Prisma,
  PrismaClient,
  Skill,
  UserImage,
} from "@prisma/client";
import { Request } from "express";
import { PubSub } from "graphql-subscriptions";
import { Context } from "graphql-ws/lib/server";
import { MongoClient } from "mongodb";
import {
  conversationPopulated,
  participantPopulated,
} from "../graphql/resolvers/conversation";
import { messagePopulated } from "../graphql/resolvers/message";

//server configs
export interface GQLContext {
  req: Request<any, any, any, any, Record<string, any>>;
  prisma: PrismaClient;
  pubsub: PubSub;
  mongoClient: MongoClient;
  userAgent: string;
}
export interface SubsciptionContext extends Context {
  connectionParams: {
    session?: Request<any, any, any, any, Record<string, any>>;
    authorization: string;
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
export type IJobInput = Pick<
  Job,
  "title" | "desc" | "jobSize" | "startDate" | "endDate" | "isDraft"
> & {
  address: IAddressInput;
  skills: ISkillInput[];
  images: IImageInput[];
  budget: IBudgetInput;
};

export type IConversationResponse = Prisma.ConversationGetPayload<{
  include: typeof conversationPopulated;
}>;

export type IMessageResponse = Prisma.MessageGetPayload<{
  include: typeof messagePopulated;
}>;

export type IParticipantResponse = Prisma.ConversationParticipantGetPayload<{
  include: typeof participantPopulated;
}>;

/**
 * Messages
 */
export type ISendMessageInput = Omit<Message, "id" | "createdAt" | "updatedAt">;
