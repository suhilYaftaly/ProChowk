import gql from "graphql-tag";

export default gql`
  type Query {
    userNotifications(
      userId: ID!
      page: Int
      pageSize: Int
    ): UserNotificationsResult!
  }
  type Mutation {
    markNotificationAsRead(notificationId: ID!): Notification!
    markAllNotificationsAsRead(userId: ID!): Boolean
    createNotification(input: CreateNotificationInput!): Notification!
      @rateLimit(limit: 5, duration: 60)
  }

  type Notification {
    id: ID!
    title: String!
    message: String
    read: Boolean!
    type: NotificationType!
    readDate: DateTime
    data: GraphQLJSON
    createdAt: DateTime
    updatedAt: DateTime
    userId: ID!
  }

  type UserNotificationsResult {
    notifications: [Notification!]!
    totalCount: Int
  }

  input CreateNotificationInput {
    userId: ID!
    title: String!
    message: String
    type: NotificationType!
  }

  enum NotificationType {
    BidAccepted
    BidRejected
    BidPlaced
    JobFinished
    ReviewReceived
  }
`;
