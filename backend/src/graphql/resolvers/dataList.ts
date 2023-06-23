import { DataList } from "@prisma/client";
import { GraphQLContext } from "../../types/userTypes";
import checkAuth from "../../utils/checkAuth";
import { gqlError } from "../../utils/funcs";
import { SkillsInput } from "../../types/dataListTypes";

export default {
  Query: {
    getAllSkills: async (
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<DataList> => {
      const { prisma } = context;

      try {
        // Retrieve the skills record from the DataList table
        const dataList = await prisma.dataList.findUnique({
          where: { type: "skills" },
        });

        if (!dataList) throw gqlError({ msg: "Skills list not found" });

        return dataList;
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
  },
  Mutation: {
    updateAllSkills: async (
      _: any,
      { skills }: { skills: SkillsInput[] },
      context: GraphQLContext
    ): Promise<DataList> => {
      const { prisma, req } = context;
      const user = checkAuth(req);

      if (skills.length < 1) {
        throw gqlError({
          msg: "Skills must not be empty",
          code: "BAD_REQUEST",
        });
      }

      // Create a Set to store unique skill labels
      const uniqueSkillLabels = new Set<string>();

      // Iterate over the skills and add their labels to the Set
      for (const skill of skills) {
        uniqueSkillLabels.add(skill.label);
      }

      // Convert the Set back to an array of skill objects
      const uniqueSkills = Array.from(uniqueSkillLabels).map((label) => ({
        label,
      }));

      try {
        // Find the existing skills record from DataList table
        const existingSkills = await prisma.dataList.findUnique({
          where: { type: "skills" },
        });

        let dataList: DataList;

        if (existingSkills) {
          // Update the existing skills record by merging the new unique skills
          const mergedSkills = [
            ...(existingSkills.data as Array<any>),
            ...uniqueSkills,
          ];
          const uniqueMergedSkills = Array.from(
            new Set(mergedSkills.map((skill) => skill.label))
          ).map((label) => ({ label }));

          // Update the skills record with the merged unique skills
          dataList = await prisma.dataList.update({
            where: { id: existingSkills.id },
            data: { data: uniqueMergedSkills },
          });
        } else {
          // Create a new skills record with the unique skills
          dataList = await prisma.dataList.create({
            data: { type: "skills", data: uniqueSkills },
          });
        }

        return dataList;
      } catch (error: any) {
        throw gqlError({ msg: error?.message });
      }
    },
  },
};
