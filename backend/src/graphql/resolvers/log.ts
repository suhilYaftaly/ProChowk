import { Log, LogsLevel } from "@prisma/client";

import { GraphQLContext } from "../../types/commonTypes";
import checkAuth, { isDeveloper } from "../../middlewares/checkAuth";
import { gqlError } from "../../utils/funcs";

export default {
  Query: {
    logs: async (
      _: any,
      { skip = 0, take = 50, orderBy = "desc", level }: ILogsInput,
      context: GraphQLContext
    ): Promise<ILogsResponse> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      if (!isDeveloper(authUser.roles)) {
        throw gqlError({ msg: "Unauthorized User", code: "FORBIDDEN" });
      }

      const logs = await prisma.log.findMany({
        skip,
        take,
        orderBy: { timestamp: orderBy },
        where: level ? { level } : undefined,
      });

      const total = await prisma.log.count({
        where: level ? { level } : undefined,
      });

      return { logs, total };
    },
  },
};

interface ILogsResponse {
  logs: Log[];
  total: number;
}

interface ILogsInput {
  /**Records to skip @default 0 */
  skip?: number;
  /**Records to take after skipping @default 50 */
  take?: number;
  /**Order by timestamp @default "desc" */
  orderBy?: "desc" | "asc";
  /**Level filter @optional */
  level?: LogsLevel;
}
