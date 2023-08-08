import { Contractor, User } from "@prisma/client";
import {
  GraphQLContext,
  ILicenseInput,
  ISkillInput,
} from "../../types/commonTypes";
import checkAuth, { canUserUpdate } from "../../utils/checkAuth";
import { showInputError, gqlError } from "../../utils/funcs";

export default {
  Query: {
    contractor: async (
      _: any,
      { id, userId }: { id?: string; userId?: string },
      context: GraphQLContext
    ): Promise<Contractor> => {
      const { prisma } = context;

      try {
        if (id || userId) {
          const eContr = await prisma.contractor.findFirst({
            where: { OR: [{ userId }, { id }] },
            include: { licenses: true, skills: true },
          });
          if (!eContr) throw gqlError({ msg: "Contractor not found" });
          return eContr;
        } else throw showInputError("userId or contractorId must be provided");
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
  },
  Mutation: {
    createContractor: async (
      _: any,
      { userId }: { userId: string },
      context: GraphQLContext
    ): Promise<User> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);
      canUserUpdate({ id: userId, authUser });

      try {
        return await prisma.user.update({
          where: { id: userId },
          data: {
            userTypes: ["client", "contractor"],
            contractor: { create: {} },
          },
          include: {
            contractor: { include: { licenses: true, skills: true } },
          },
        });
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
    addContractorLicense: async (
      _: any,
      { contId, license }: { contId: string; license: ILicenseInput },
      context: GraphQLContext
    ): Promise<Contractor> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      try {
        const cont = await prisma.contractor.findUnique({
          where: { id: contId },
        });
        canUserUpdate({ id: cont.userId, authUser });

        return await prisma.contractor.update({
          where: { id: contId },
          data: { licenses: { create: license } },
          include: { licenses: true, skills: true },
        });
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
    deleteContractorLicense: async (
      _: any,
      { contId, licId }: { contId: string; licId: string },
      context: GraphQLContext
    ): Promise<Contractor> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      try {
        const cont = await prisma.contractor.findUnique({
          where: { id: contId },
        });
        canUserUpdate({ id: cont.userId, authUser });
        return await prisma.contractor.update({
          where: { id: contId },
          data: { licenses: { delete: { id: licId } } },
          include: { licenses: true, skills: true },
        });
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
    addOrRemoveContractorSkills: async (
      _: any,
      { contId, skills }: { contId: string; skills: ISkillInput[] },
      context: GraphQLContext
    ): Promise<Contractor> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      try {
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
          include: { skills: true, licenses: true },
        });
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
  },
};
