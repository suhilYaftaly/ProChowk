import { gql } from "graphql-tag";

export default gql`
  scalar GraphQLJSON
  scalar Date

  type Query {
    logs(
      skip: Int
      take: Int
      orderBy: OrderBy
      level: LogsLevel
    ): LogsResponse!
  }

  type Log {
    id: ID!
    timestamp: Date!
    level: LogsLevel!
    message: String!
    meta: GraphQLJSON
  }
  type LogsResponse {
    logs: [Log!]!
    total: Int!
  }

  enum LogsLevel {
    error
    warn
    info
    log
  }
  enum OrderBy {
    desc
    asc
  }
`;
