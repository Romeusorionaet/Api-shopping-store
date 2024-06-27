import { NotificationsRepository } from "src/domain/notification/application/repositories/notification-repository";
import { prisma } from "src/infra/service/setup-prisma/prisma";
import { PrismaNotificationMapper } from "../mappers/prisma-notification-mapper";
import { Notification } from "src/domain/notification/enterprise/entities/notification";

export class PrismaNotificationsRepository implements NotificationsRepository {
  async findById(id: string): Promise<Notification | null> {
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return null;
    }

    return PrismaNotificationMapper.toDomain(notification);
  }

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification);

    await prisma.notification.create({ data });
  }

  async save(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification);

    await prisma.notification.update({
      where: { id: notification.id.toString() },
      data,
    });
  }

  async findManyByRecipientId(recipientId: string): Promise<Notification[]> {
    const notifications = await prisma.notification.findMany({
      where: {
        recipientId,
      },
    });

    return notifications.map(PrismaNotificationMapper.toDomain);
  }
}
