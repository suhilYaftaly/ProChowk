import { Skill } from "@prisma/client";
import { GQLContext } from "../../types/commonTypes";
import { gqlError } from "../../utils/funcs";

export default {
  Query: {
    skills: async (_: any, __: any, context: GQLContext): Promise<Skill[]> => {
      const { prisma } = context;

      const skills = await prisma.skill.findMany();
      if (!skills) throw gqlError({ msg: "Skills not found" });
      return skills;
    },
  },
};
