import { GraphQLResolveInfo } from "graphql";
import { GQLContext } from "../../types/commonTypes";

export default {
  Query: {
    messages: async (
      _: any,
      { conversationId }: { conversationId: string },
      context: GQLContext,
      info: GraphQLResolveInfo
    ): Promise<IMessageResponse[]> => {
      const { prisma } = context;
      const messages = await prisma.message.findMany({
        where: { conversationId },
      });
      return messages.map((msg) => {
        return {
          id: msg.id,
          message: msg.message,
          user: "asdf",
        } as unknown as IMessageResponse;
      });
    },
  },
};

interface IMessageResponse {
  id: number;
  message: string;
  user: string;
}
