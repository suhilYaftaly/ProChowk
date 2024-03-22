import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { notificationFields } from "../gqlFrags";
import { asyncOps } from "./gqlFuncs";

const notificationOps = {
  Queries: {
    userNotifications: gql`query UserNotifications($userId: ID!, $page: Int, $pageSize: Int) {
      userNotifications(userId: $userId, page: $page, pageSize: $pageSize) {
        totalCount 
        notifications {${notificationFields}}
      }
    }`,
  },
  Mutations: {
    markNotificationAsRead: gql`mutation MarkNotificationAsRead($notificationId: ID!) {
        markNotificationAsRead(notificationId: $notificationId) {${notificationFields}}
      }`,
    markAllNotificationsAsRead: gql`
      mutation MarkAllNotificationsAsRead($userId: ID!) {
        markAllNotificationsAsRead(userId: $userId)
      }
    `,
  },
};

//TYPES
export type TNotification = {
  id: string;
  title: string;
  message?: string;
  read: boolean;
  type: NotificationType;
  readDate: Date | null;
  data: any;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

type NotificationType =
  | "BidAccepted"
  | "BidRejected"
  | "BidPlaced"
  | "BidCompleted"
  | "JobFinished"
  | "ReviewReceived";

//OPERATIONS
//userNotifications OP
type TUserNotificationsData = {
  userNotifications: { totalCount?: number; notifications: TNotification[] };
};
type TUserNotificationsInput = {
  userId: string;
  page?: number;
  pageSize?: number;
};
type TUserNotificationsAsync = {
  variables: TUserNotificationsInput;
  onSuccess?: (data: TUserNotificationsData["userNotifications"]) => void;
  onError?: (error?: any) => void;
};
export const useUserNotifications = () => {
  const [userNotifications, { data, loading, error }] = useLazyQuery<
    TUserNotificationsData,
    TUserNotificationsInput
  >(notificationOps.Queries.userNotifications, {
    fetchPolicy: "network-only",
  });

  const userNotificationsAsync = async ({
    variables,
    onSuccess,
    onError,
  }: TUserNotificationsAsync) =>
    asyncOps({
      operation: () => userNotifications({ variables }),
      onSuccess: (dt: TUserNotificationsData) =>
        onSuccess && onSuccess(dt.userNotifications),
      onError,
    });

  return {
    userNotificationsAsync,
    data,
    loading,
    error,
  };
};

//markNotificationAsRead OP
type TMNARData = { markNotificationAsRead: TNotification };
type TMNARInput = { notificationId: string };
type TMNARAsunc = {
  variables: TMNARInput;
  onSuccess?: (data: TMNARData["markNotificationAsRead"]) => void;
  onError?: (error?: any) => void;
};
export const useMarkNotificationAsRead = () => {
  const [markNotificationAsRead, { data, loading, error }] = useMutation<
    TMNARData,
    TMNARInput
  >(notificationOps.Mutations.markNotificationAsRead);

  const markNotificationAsReadAsync = async ({
    variables,
    onSuccess,
    onError,
  }: TMNARAsunc) =>
    asyncOps({
      operation: () => markNotificationAsRead({ variables }),
      onSuccess: (dt: TMNARData) => {
        onSuccess && onSuccess(dt.markNotificationAsRead);
      },
      onError,
    });

  return { markNotificationAsReadAsync, data, loading, error };
};
//markAllNotificationsAsRead OP
type TMANARInput = { userId: string };
type TMANARAsunc = {
  variables: TMANARInput;
  onSuccess?: () => void;
  onError?: (error?: any) => void;
};
export const useMarkAllNotificationsAsRead = () => {
  const [markAllNotificationsAsRead, { data, loading, error }] = useMutation<
    TMNARData,
    TMANARInput
  >(notificationOps.Mutations.markAllNotificationsAsRead);

  const markAllNotificationsAsReadAsync = async ({
    variables,
    onSuccess,
    onError,
  }: TMANARAsunc) =>
    asyncOps({
      operation: () => markAllNotificationsAsRead({ variables }),
      onSuccess: () => onSuccess && onSuccess(),
      onError,
    });

  return { markAllNotificationsAsReadAsync, data, loading, error };
};
