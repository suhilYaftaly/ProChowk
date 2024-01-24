import { Contractor, User } from "@prisma/client";
import { GraphQLResolveInfo } from "graphql";

import {
  GQLContext,
  ILicenseInput,
  ISkillInput,
} from "../../types/commonTypes";
import checkAuth, { canUserUpdate } from "../../middlewares/checkAuth";
import {
  showInputError,
  gqlError,
  ifr,
  infr,
  calculateAverageRating,
} from "../../utils/funcs";
import {
  ADDRESS_COLL,
  CONTRACTOR_COLL,
  SKILL_COLL,
  USER_COLL,
} from "../../constants/dbCollectionNames";

export default {
  Query: {
    contractor: async (
      _: any,
      { id, userId }: { id?: string; userId?: string },
      context: GQLContext,
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
    contractorsByLocation: async (
      _: any,
      { latLng, radius = 60, page = 1, pageSize = 100 }: IContByLocInput,
      context: GQLContext,
      info: GraphQLResolveInfo
    ): Promise<{ totalCount: number; users: User[] }> => {
      const { mongoClient, prisma } = context;
      const db = mongoClient.db();
      const distanceInMeters = radius * 1000;
      const skip = (page - 1) * pageSize;

      const commonPipeline = [
        {
          $geoNear: {
            near: { type: "Point", coordinates: [latLng.lng, latLng.lat] },
            distanceField: "distance",
            maxDistance: distanceInMeters,
            spherical: true,
          },
        },
        {
          $lookup: {
            from: USER_COLL,
            localField: "_id",
            foreignField: "addressId",
            as: "nearbyUsers",
          },
        },
        { $unwind: "$nearbyUsers" },
        {
          $match: {
            "nearbyUsers.userTypes": { $in: ["contractor"] }, // Match users with 'contractor' userType
          },
        },
      ];

      const aggregation = await db
        .collection(ADDRESS_COLL)
        .aggregate([
          ...commonPipeline,
          {
            $facet: {
              paginatedResults: [{ $skip: skip }, { $limit: pageSize }],
              totalCount: [{ $count: "total" }],
            },
          },
        ])
        .toArray();

      const paginatedResults = aggregation[0].paginatedResults;
      const totalCount = aggregation[0].totalCount[0]?.total || 0;

      const userIds = paginatedResults.map((item: any) =>
        item?.nearbyUsers?._id.toString()
      );

      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        include: {
          address: infr(info, "users", "address"),
          image: infr(info, "users", "image"),
          contractor: { include: { skills: { select: { label: true } } } },
          receivedReviews: { select: { rating: true } },
        },
      });

      const orderedUsers = userIds.map((userId: string) => {
        const user = users.find((u) => u.id === userId);
        if (user) {
          const averageRating = calculateAverageRating(
            user.receivedReviews as any
          );
          return { ...user, averageRating };
        }
        return undefined;
      });
      return { users: orderedUsers, totalCount };
    },
    contractorsByText: async (
      _: any,
      { input, latLng, radius = 60, page = 1, pageSize = 100 }: IContByTxtInput,
      context: GQLContext,
      info: GraphQLResolveInfo
    ): Promise<{ totalCount: number; users: User[] }> => {
      const { mongoClient, prisma } = context;
      const db = mongoClient.db();
      const distanceInMeters = radius * 1000;

      const skills = await db
        .collection(SKILL_COLL)
        .find({ $text: { $search: input } }, { projection: { _id: 1 } })
        .toArray();
      const skillIds = skills.map((skill) => skill._id);

      const matchingUsers = await db
        .collection(USER_COLL)
        .find({
          $text: { $search: input },
          userTypes: { $in: ["contractor"] },
        })
        .toArray();
      const userIdsFromTextSearch = matchingUsers.map((user) => user._id);

      const skip = (page - 1) * pageSize;

      const result = await db
        .collection(ADDRESS_COLL)
        .aggregate([
          {
            $geoNear: {
              near: { type: "Point", coordinates: [latLng.lng, latLng.lat] },
              distanceField: "distance",
              maxDistance: distanceInMeters,
              spherical: true,
            },
          },
          {
            $lookup: {
              from: USER_COLL,
              localField: "_id",
              foreignField: "addressId",
              as: "associatedUsers",
            },
          },
          { $unwind: "$associatedUsers" },
          {
            $lookup: {
              from: CONTRACTOR_COLL,
              localField: "associatedUsers._id",
              foreignField: "userId",
              as: "associatedContractors",
            },
          },
          { $unwind: "$associatedContractors" },
          {
            $match: {
              $and: [
                { "associatedUsers.userTypes": { $in: ["contractor"] } },
                {
                  $or: [
                    { "associatedUsers._id": { $in: userIdsFromTextSearch } },
                    { "associatedContractors.skillIDs": { $in: skillIds } },
                  ],
                },
              ],
            },
          },
          {
            $facet: {
              paginatedResults: [{ $skip: skip }, { $limit: pageSize }],
              totalCount: [{ $count: "total" }],
            },
          },
        ])
        .toArray();

      const paginatedResults = result[0]?.paginatedResults || [];
      const totalCount = result[0]?.totalCount[0]?.total || 0;

      const userIds = paginatedResults.map((item: any) =>
        item?.associatedUsers?._id.toString()
      );
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        include: {
          address: infr(info, "users", "address"),
          image: infr(info, "users", "image"),
          contractor: { include: { skills: { select: { label: true } } } },
          receivedReviews: { select: { rating: true } },
        },
      });

      const orderedUsers = userIds.map((userId: string) => {
        const user = users.find((u) => u.id === userId);
        if (user) {
          const averageRating = calculateAverageRating(
            user.receivedReviews as any
          );
          return { ...user, averageRating };
        }
        return undefined;
      });

      return { users: orderedUsers, totalCount };
    },
  },
  Mutation: {
    createContractor: async (
      _: any,
      { userId }: { userId: string },
      context: GQLContext,
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
      context: GQLContext,
      info: GraphQLResolveInfo
    ): Promise<Contractor> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      const cont = await prisma.contractor.findUnique({
        where: { id: contId },
      });
      if (!cont) throw gqlError({ msg: "Contractor not found!" });
      canUserUpdate({ id: cont?.userId, authUser });

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
      context: GQLContext,
      info: GraphQLResolveInfo
    ): Promise<Contractor> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      const cont = await prisma.contractor.findUnique({
        where: { id: contId },
      });
      if (!cont) throw gqlError({ msg: "Contractor not found!" });
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
      context: GQLContext,
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

interface IContByLocInput {
  latLng: { lat: number; lng: number };
  radius?: number;
  page?: number;
  pageSize?: number;
}

interface IContByTxtInput {
  input: string;
  latLng: { lat: number; lng: number };
  radius?: number;
  page?: number;
  pageSize?: number;
}
