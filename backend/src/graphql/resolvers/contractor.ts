import {
  ContPropReturn,
  Contractor,
  ContractorUser,
  CreateContractorProfileInput,
  License,
  Skill,
} from "../../types/contractorTypes";
import { GraphQLContext } from "../../types/userTypes";
import checkAuth from "../../utils/checkAuth";
import { gqlError } from "../../utils/funcs";
import { validateCreateContInput } from "../../utils/validators/contractorValidators";

export default {
  Query: {
    searchContrProf: async (
      _: any,
      { userId }: { userId: string },
      context: GraphQLContext
    ): Promise<Contractor> => {
      const { prisma } = context;

      try {
        const eUser = await prisma.user.findUnique({
          where: { id: userId },
        });
        if (!eUser)
          throw gqlError({ msg: "User not found", code: "BAD_REQUEST" });

        const contrProfile = await prisma.contractorProfile.findUnique({
          where: { userId },
        });
        if (!contrProfile) {
          throw gqlError({
            msg: "Contractor profile not found",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        return getContProps(contrProfile, eUser);
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
  },
  Mutation: {
    updateContrProf: async (
      _: any,
      { skills, licenses }: CreateContractorProfileInput,
      context: GraphQLContext
    ): Promise<Contractor> => {
      const { prisma, req } = context;
      const user = checkAuth(req);
      const inputErr = validateCreateContInput(
        skills as Skill[] | undefined,
        licenses as License[] | undefined
      );
      if (inputErr) throw inputErr;

      try {
        const eUser = await prisma.user.findUnique({
          where: { id: user.id },
        });

        if (!eUser)
          throw gqlError({ msg: "User not found", code: "BAD_REQUEST" });
        const existingContr = await prisma.contractorProfile.findUnique({
          where: { userId: user.id },
        });

        let contProfile;

        if (existingContr) {
          contProfile = await prisma.contractorProfile.update({
            where: { userId: user.id },
            data: { skills, licenses, userEmail: user.email },
          });
        } else {
          contProfile = await prisma.contractorProfile.create({
            data: {
              user: { connect: { id: user.id } },
              skills,
              licenses,
              userEmail: user.email,
            },
            include: { user: true },
          });
        }

        if (!contProfile) {
          throw gqlError({
            msg: "Failed to update contractor profile",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        return getContProps(contProfile, eUser);
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
  },
};

const getContProps = (contractor: ContPropReturn, user: ContractorUser) => {
  return {
    ...contractor,
    user: { id: user.id, name: user.name, email: user.email },
  };
};
