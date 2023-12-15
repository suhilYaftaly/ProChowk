import { Contractor, User } from "@prisma/client";
import { GraphQLResolveInfo } from "graphql";

import {
  GraphQLContext,
  ILicenseInput,
  ISkillInput,
} from "../../types/commonTypes";
import checkAuth, { canUserUpdate } from "../../middlewares/checkAuth";
import { showInputError, gqlError, IFR } from "../../utils/funcs";

export default {
  Query: {
    contractor: async (
      _: any,
      { id, userId }: { id?: string; userId?: string },
      context: GraphQLContext,
      info: GraphQLResolveInfo
    ): Promise<Contractor> => {
      const { prisma } = context;

      if (id || userId) {
        const eContr = await prisma.contractor.findFirst({
          where: { OR: [{ userId }, { id }] },
          include: {
            licenses: IFR(info, "licenses"),
            skills: IFR(info, "skills"),
          },
        });
        if (!eContr) throw gqlError({ msg: "Contractor not found" });
        return eContr;
      } else throw showInputError("userId or contractorId must be provided");
    },
  },
  Mutation: {
    createContractor: async (
      _: any,
      { userId }: { userId: string },
      context: GraphQLContext,
      info: GraphQLResolveInfo
    ): Promise<User> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);
      canUserUpdate({ id: userId, authUser });

      return await prisma.user.update({
        where: { id: userId },
        data: {
          userTypes: ["client", "contractor"],
          contractor: { create: {} },
        },
        include: {
          contractor: {
            include: {
              licenses: IFR(info, "licenses"),
              skills: IFR(info, "skills"),
            },
          },
        },
      });
    },
    addContractorLicense: async (
      _: any,
      { contId, license }: { contId: string; license: ILicenseInput },
      context: GraphQLContext,
      info: GraphQLResolveInfo
    ): Promise<Contractor> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      const cont = await prisma.contractor.findUnique({
        where: { id: contId },
      });
      canUserUpdate({ id: cont.userId, authUser });

      return await prisma.contractor.update({
        where: { id: contId },
        data: { licenses: { create: license } },
        include: {
          licenses: IFR(info, "licenses"),
          skills: IFR(info, "skills"),
        },
      });
    },
    deleteContractorLicense: async (
      _: any,
      { contId, licId }: { contId: string; licId: string },
      context: GraphQLContext,
      info: GraphQLResolveInfo
    ): Promise<Contractor> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      const cont = await prisma.contractor.findUnique({
        where: { id: contId },
      });
      canUserUpdate({ id: cont.userId, authUser });
      return await prisma.contractor.update({
        where: { id: contId },
        data: { licenses: { delete: { id: licId } } },
        include: {
          licenses: IFR(info, "licenses"),
          skills: IFR(info, "skills"),
        },
      });
    },
    addOrRemoveContractorSkills: async (
      _: any,
      { contId, skills }: { contId: string; skills: ISkillInput[] },
      context: GraphQLContext,
      info: GraphQLResolveInfo
    ): Promise<Contractor> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      const contractor = await prisma.contractor.findUnique({
        where: { id: contId },
        include: { skills: true },
      });
      canUserUpdate({ id: contractor.userId, authUser });
      if (!contractor) throw gqlError({ msg: "Contractor not found" });

      // Determine the IDs of the skills to disconnect
      const skillIdsToDisconnect = contractor.skills
        .filter((skill) => !skills.some((s) => s.label === skill.label))
        .map((skill) => ({ id: skill.id }));

      // Prepare connectOrCreate operations
      const connectOrCreateOperations = skills.map((skill) => ({
        where: { label: skill.label },
        create: skill,
      }));

      // Perform one update operation that disconnects and connects or creates skills
      await prisma.contractor.update({
        where: { id: contId },
        data: {
          skills: {
            disconnect: skillIdsToDisconnect,
            connectOrCreate: connectOrCreateOperations,
          },
        },
      });

      return await prisma.contractor.findUnique({
        where: { id: contId },
        include: {
          licenses: IFR(info, "licenses"),
          skills: IFR(info, "skills"),
        },
      });
    },
  },
};
