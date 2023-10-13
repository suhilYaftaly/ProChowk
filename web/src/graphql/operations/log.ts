import { gql, useApolloClient, useLazyQuery } from "@apollo/client";
import { asyncOps } from "./gqlFuncs";

export const logGqlResp = gql`
  fragment LogFields on Log {
    id
    timestamp
    level
    message
    meta
  }
`;

const logOps = {
  Queries: {
    logs: gql`
      ${logGqlResp}
      query Logs($skip: Int, $take: Int, $orderBy: OrderBy, $level: LogsLevel) {
        logs(skip: $skip, take: $take, orderBy: $orderBy, level: $level) {
          total
          logs {
            ...LogFields
          }
        }
      }
    `,
  },
};

/**
 * INTERFACES/TYPES
 */
//interfaces
export interface ILog {
  id: string;
  timestamp: Date;
  level: LogsLevel;
  message: string;
  meta: any;
}
interface LogsResponse {
  logs: ILog[];
  total: number;
}
interface ILogsInput {
  /**Records to skip @default 0 */
  skip?: number;
  /**Records to take after skipping @default 10 */
  take?: number;
  /**Order by timestamp @default "desc" */
  orderBy?: OrderBy;
  /**Level filter @optional */
  level?: LogsLevel;
}

//types
type LogsLevel = "error" | "warn" | "info" | "log";
type OrderBy = "desc" | "asc";

/**
 * OPERATIONS
 */
//useLogs op
interface ILogsData {
  logs: LogsResponse;
}
interface ILogsIAsync {
  variables?: ILogsInput;
  onSuccess?: (data: LogsResponse) => void;
  onError?: (error?: any) => void;
}

export const useLogs = () => {
  const client = useApolloClient();
  const [logs, { data, loading, error }] = useLazyQuery<ILogsData, ILogsInput>(
    logOps.Queries.logs
  );

  const logsAsync = async ({ variables, onSuccess, onError }: ILogsIAsync) =>
    asyncOps({
      operation: () => logs({ variables }),
      onSuccess: (dt: ILogsData) => onSuccess && onSuccess(dt.logs),
      onError,
    });

  const updateLogsCache = (
    action: "create" | "update" | "delete" | "deleteMany",
    log: ILog | ILog[],
    variables: ILogsIAsync["variables"]
  ) => {
    const cachedData = client.readQuery<ILogsData, ILogsInput>({
      query: logOps.Queries.logs,
      variables,
    });

    if (cachedData) {
      let modifiedData: ILog[] = [...cachedData.logs.logs];
      let deletedCount = 0; // to keep track of how many logs have been deleted

      switch (action) {
        case "create":
          modifiedData.unshift(log as ILog);
          break;
        case "update":
          modifiedData = modifiedData.map((l) =>
            l.id === (log as ILog).id ? (log as ILog) : l
          );
          break;
        case "delete":
          modifiedData = modifiedData.filter((l) => l.id !== (log as ILog).id);
          deletedCount = 1;
          break;
        case "deleteMany":
          const idsToDelete = new Set((log as ILog[]).map((l) => l.id));
          deletedCount = modifiedData.reduce(
            (count, l) => (idsToDelete.has(l.id) ? count + 1 : count),
            0
          );
          modifiedData = modifiedData.filter((l) => !idsToDelete.has(l.id));
          break;
        default:
          throw new Error("Invalid action type");
      }

      const newTotal = cachedData.logs.total - deletedCount;

      client.writeQuery<ILogsData, ILogsInput>({
        query: logOps.Queries.logs,
        data: { logs: { logs: modifiedData, total: newTotal } },
        variables,
      });
    }
  };

  return { logsAsync, updateLogsCache, data, loading, error };
};
