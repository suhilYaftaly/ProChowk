import { Contractor, User } from "@prisma/client";
import {
  GraphQLContext,
  ILicenseInput,
  ISkillInput,
} from "../../types/commonTypes";
import checkAuth, { canUserUpdate } from "../../utils/checkAuth";
import { getIErr, gqlError } from "../../utils/funcs";

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
        } else throw getIErr("userId or contractorId must be provided");
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

        // Fetch all existing skill labels
        const allSkills = await prisma.skill.findMany({
          select: { label: true },
        });
        const allSkillLabels = allSkills.map((skill) => skill.label);

        if (!contractor) throw gqlError({ msg: "Contractor not found" });

        // Separate the input skills into existing and new
        const existingSkills = skills.filter((skill) =>
          allSkillLabels.includes(skill.label)
        );
        const newSkills = skills.filter(
          (skill) => !allSkillLabels.includes(skill.label)
        );

        // Disconnect the existing skills that are not in the input
        const skillDisconnects = contractor.skills
          .filter(
            (skill) => !existingSkills.some((s) => s.label === skill.label)
          )
          .map((skill) =>
            prisma.contractor.update({
              where: { id: contId },
              data: { skills: { disconnect: { id: skill.id } } },
            })
          );

        // Connect or create new skills
        const skillConnects = [...existingSkills, ...newSkills].map((skill) =>
          prisma.contractor.update({
            where: { id: contId },
            data: {
              skills: {
                connectOrCreate: {
                  where: { label: skill.label },
                  create: skill,
                },
              },
            },
          })
        );

        // Execute the operations in parallel
        await Promise.all([...skillDisconnects, ...skillConnects]);

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
