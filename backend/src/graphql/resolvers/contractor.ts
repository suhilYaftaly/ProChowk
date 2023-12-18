import { Contractor, User } from "@prisma/client";
import { GraphQLResolveInfo } from "graphql";

import {
  GraphQLContext,
  ILicenseInput,
  ISkillInput,
} from "../../types/commonTypes";
import checkAuth, { canUserUpdate } from "../../middlewares/checkAuth";
import { showInputError, gqlError, ifr } from "../../utils/funcs";

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
            licenses: ifr(info, "licenses"),
            skills: ifr(info, "skills"),
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
              licenses: ifr(info, "licenses"),
              skills: ifr(info, "skills"),
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
          licenses: ifr(info, "licenses"),
          skills: ifr(info, "skills"),
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
          licenses: ifr(info, "licenses"),
          skills: ifr(info, "skills"),
        },
      });
    },
    updateContractorSkills: async (
      _: any,
      { contId, skills }: { contId: string; skills: ISkillInput[] },
      context: GraphQLContext,
      info: GraphQLResolveInfo
    ): Promise<Contractor> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      const foundCont = await prisma.contractor.findUnique({
        where: { id: contId },
        include: { skills: true },
      });
      if (!foundCont) throw gqlError({ msg: "Contractor not found" });
      canUserUpdate({ id: foundCont.userId, authUser });

      const foundSkills = foundCont?.skills;
      // Determine skills to disconnect and prepare connectOrCreate operations
      const existingSkillLabels = foundSkills?.map((skill) => skill.label);
      const skillsToDisconnect = foundSkills?.filter(
        (skill) => !skills.some((s) => s.label === skill.label)
      );
      const skillsToConnectOrCreate = skills?.filter(
        (skill) => !existingSkillLabels?.includes(skill.label)
      );

      return await prisma.contractor.update({
        where: { id: contId },
        data: {
          skills: {
            disconnect: skillsToDisconnect.map((skill) => ({ id: skill.id })),
            connectOrCreate: skillsToConnectOrCreate.map((skill) => ({
              where: { label: skill.label },
              create: skill,
            })),
          },
        },
        include: {
          licenses: ifr(info, "licenses"),
          skills: ifr(info, "skills"),
        },
      });
    },
  },
};
