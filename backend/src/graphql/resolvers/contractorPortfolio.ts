import { ContractorPortfolio } from "@prisma/client";
import { z } from "zod";
import { GraphQLResolveInfo } from "graphql";

import { GQLContext } from "../../types/commonTypes";
import checkAuth, { canUserUpdate } from "../../middlewares/checkAuth";
import { gqlError, ifr } from "../../utils/funcs";

export default {
  Query: {
    getContractorPortfolios: async (
      _: any,
      { contractorId }: { contractorId: string },
      context: GQLContext,
      info: GraphQLResolveInfo
    ): Promise<ContractorPortfolio[]> => {
      const { prisma } = context;

      const portfolios = await prisma.contractorPortfolio.findMany({
        where: { contractorId },
        include: { images: ifr(info, "images") },
      });

      return portfolios;
    },
  },
  Mutation: {
    addContractorPortfolio: async (
      _: any,
      args: PortfolioInput,
      context: GQLContext
    ): Promise<ContractorPortfolio> => {
      const { prisma, req } = context;

      const validatedInput = PortfolioInputSchema.parse(args);
      const { contractorId, title, description, images } = validatedInput;

      const authUser = checkAuth(req);

      const cont = await prisma.contractor.findUnique({
        where: { id: contractorId },
      });
      if (!cont) throw gqlError({ msg: "Contractor not found!" });

      canUserUpdate({ id: cont.userId, authUser });

      const portfolio = await prisma.contractorPortfolio.create({
        data: {
          title,
          description,
          images: {
            createMany: {
              data:
                images?.map((image) => ({
                  url: image.url,
                  name: image.name,
                  type: image.type,
                  size: image.size,
                })) ?? [],
            },
          },
          contractor: { connect: { id: contractorId } },
        },
      });

      return portfolio;
    },
    updateContractorPortfolio: async (
      _: any,
      args: UpdatePortfolioInput,
      context: GQLContext
    ): Promise<ContractorPortfolio> => {
      const validatedInput = UpdatePortfolioInputSchema.parse(args);
      const { id, title, description, images: newImages = [] } = validatedInput;

      const { prisma, req } = context;
      const authUser = checkAuth(req);

      // Fetch the existing portfolio to perform checks and get current images
      const existingPortfolio = await prisma.contractorPortfolio.findUnique({
        where: { id },
        include: { images: true },
      });
      if (!existingPortfolio) throw gqlError({ msg: "Portfolio not found!" });

      // Authorization check
      canUserUpdate({ id: existingPortfolio.contractorId, authUser });

      // Existing image URLs for comparison
      const existingImageUrls = existingPortfolio.images.map(
        (image) => image.url
      );

      // Determine new images by checking against existing image URLs
      const imagesToAdd = newImages.filter(
        (newImage) => !existingImageUrls.includes(newImage.url)
      );

      // Determine images to delete by checking if existing images are not in the new images list
      const imagesToDelete = existingPortfolio.images.filter(
        (existingImage) =>
          !newImages.some((newImage) => newImage.url === existingImage.url)
      );

      // Delete images not present in the new images list
      if (imagesToDelete.length > 0) {
        await prisma.portfolioImage.deleteMany({
          where: {
            id: { in: imagesToDelete.map((image) => image.id) },
          },
        });
      }

      // Update the portfolio and add new images
      const updatedPortfolio = await prisma.contractorPortfolio.update({
        where: { id },
        data: {
          title,
          description: description || existingPortfolio?.description,
          // Conditional operation for adding new images
          ...(imagesToAdd.length && {
            images: {
              createMany: {
                data: imagesToAdd.map(({ url, name, type, size }) => ({
                  url,
                  name,
                  type,
                  size,
                })),
              },
            },
          }),
        },
        include: { images: true },
      });

      return updatedPortfolio;
    },
    deleteContractorPortfolio: async (
      _: any,
      { id }: { id: string },
      context: GQLContext
    ): Promise<boolean> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      // Fetch portfolio to perform auth checks before deletion
      const portfolio = await prisma.contractorPortfolio.findUnique({
        where: { id },
      });
      if (!portfolio) throw gqlError({ msg: "Portfolio not found!" });

      canUserUpdate({ id: portfolio.contractorId, authUser });

      // Delete portfolio
      await prisma.contractorPortfolio.delete({ where: { id } });

      return true;
    },
  },
};

const PortfolioInputSchema = z.object({
  contractorId: z.string(),
  title: z.string().min(1, "Title must not be empty."),
  description: z.string().optional(),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        name: z.string().optional(),
        type: z.string().optional(),
        size: z.number().optional(),
      })
    )
    .min(1),
});
type PortfolioInput = z.infer<typeof PortfolioInputSchema>;

const UpdatePortfolioInputSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title must not be empty."),
  description: z.string().optional(),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        name: z.string().optional(),
        type: z.string().optional(),
        size: z.number().optional(),
      })
    )
    .min(1),
});
type UpdatePortfolioInput = z.infer<typeof UpdatePortfolioInputSchema>;
