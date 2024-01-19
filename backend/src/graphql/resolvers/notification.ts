import { Notification } from "@prisma/client";
import { z } from "zod";

import { GQLContext } from "../../types/commonTypes";
import checkAuth, { canUserUpdate } from "../../middlewares/checkAuth";
import { gqlError } from "../../utils/funcs";

export default {
  Query: {
    userNotifications: async (
      _: any,
      { userId, page = 1, pageSize = 50 }: UserNotificationsInput,
      { prisma }: GQLContext
    ): Promise<{ totalCount: number; notifications: Notification[] }> => {
      const parsedProps = UserNotificationsInputSchema.safeParse({
        userId,
        page,
        pageSize,
      });
      if (!parsedProps.success) {
        throw gqlError({ msg: parsedProps?.error?.message });
      }

      const skip = (page - 1) * pageSize;

      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      });

      const totalCount = await prisma.notification.count({
        where: { userId },
      });

      return {
        notifications,
        totalCount,
      };
    },
  },
  Mutation: {
    markNotificationAsRead: async (
      _: any,
      { notificationId }: { notificationId: string },
      context: GQLContext
    ): Promise<Notification> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      // Check if the notification exists
      const notification = await prisma.notification.findUnique({
        where: { id: notificationId },
      });
      if (!notification) throw gqlError({ msg: "Notification not found!" });
      canUserUpdate({ id: notification.userId, authUser });

      return await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true, readDate: new Date() },
      });
    },
    markAllNotificationsAsRead: async (
      _: any,
      { userId }: { userId: string },
      context: GQLContext
    ): Promise<boolean> => {
      const { prisma, req } = context;
      const authUser = checkAuth(req);

      // Authorization check: ensure the user is allowed to perform this action
      canUserUpdate({ id: userId, authUser });

      await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true, readDate: new Date() },
      });

      return true;
    },
  },
};

const UserNotificationsInputSchema = z.object({
  userId: z.string().length(24),
  page: z.number().min(1),
  pageSize: z.number().min(1).max(100),
});

type UserNotificationsInput = z.infer<typeof UserNotificationsInputSchema>;
