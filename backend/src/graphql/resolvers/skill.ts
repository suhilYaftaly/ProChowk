import { Skill } from "@prisma/client";
import { GQLContext } from "../../types/commonTypes";

export default {
  Query: {
    skills: async (
      _: any,
      { search, limit = 5 }: { search: string; limit?: number },
      context: GQLContext
    ): Promise<Skill[]> => {
      const { prisma } = context;

      const skills = await prisma.skill.findMany({
        where: { label: { contains: search, mode: "insensitive" } },
        take: limit,
      });

      return skills;
    },
  },
};
