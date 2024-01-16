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
    createNotification: gql`mutation CreateNotification($input: CreateNotificationInput!) {
        createNotification(input: $input) {${notificationFields}}
      }`,
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

type NotificationType = "BidAccepted" | "BidRejected" | "BidPlaced";

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

//createNotification OP
type TCNData = { createNotification: TNotification };
type TCNInputProp = {
  userId: string;
  title: string;
  type: NotificationType;
  message?: string;
  data?: any;
};
type TCNInput = { input: TCNInputProp };
type TCNAsync = {
  variables: TCNInput;
  onSuccess?: (data: TCNData["createNotification"]) => void;
  onError?: (error?: any) => void;
};
export const useCreateNotification = () => {
  const [createNotification, { data, loading, error }] = useMutation<
    TCNData,
    TCNInput
  >(notificationOps.Mutations.createNotification);

  const createNotificationAsync = async ({
    variables,
    onSuccess,
    onError,
  }: TCNAsync) =>
    asyncOps({
      operation: () => createNotification({ variables }),
      onSuccess: (dt: TCNData) => {
        onSuccess && onSuccess(dt.createNotification);
      },
      onError,
    });

  return { createNotificationAsync, data, loading, error };
};
