import { NotificationsRepository } from "src/domain/notification/application/repositories/notification-repository";
import { prisma } from "src/infra/service/setup-prisma/prisma";
import { PrismaNotificationMapper } from "../mappers/prisma-notification-mapper";
import { Notification } from "src/domain/notification/enterprise/entities/notification";
import { CacheRepository } from "src/infra/cache/cache-repository";
import { CacheKeysPrefix } from "src/core/constants/cache-keys-prefix";
import { CacheTimeInMinutes } from "src/core/constants/cache-time-in-minutes";

export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private cacheRepository: CacheRepository) {}

  async create(notification: Notification, recipientId: string): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification);

    await prisma.notification.create({ data });

    await this.cacheRepository.deleteCacheByPattern(
      `${CacheKeysPrefix.NOTIFICATION_LIST}:${recipientId}:*`,
    );
  }

  async findById(id: string): Promise<Notification | null> {
    const cacheKey = `${CacheKeysPrefix.NOTIFICATION}:unique:${id}`;

    const cacheHit = await this.cacheRepository.get(cacheKey);

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit);

      return PrismaNotificationMapper.toDomain(cacheData);
    }

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return null;
    }

    await this.cacheRepository.set(
      cacheKey,
      JSON.stringify(notification),
      CacheTimeInMinutes.notificationTime,
    );

    return PrismaNotificationMapper.toDomain(notification);
  }

  async update(notification: Notification, recipientId: string): Promise<void> {
    const data = PrismaNotificationMapper.toPrisma(notification);

    await prisma.notification.update({
      where: { id: notification.id.toString() },
      data,
    });

    await this.cacheRepository.delete(
      `${CacheKeysPrefix.NOTIFICATION}:unique:${data.id}`,
    );

    await this.cacheRepository.deleteCacheByPattern(
      `${CacheKeysPrefix.NOTIFICATION_LIST}:${recipientId}:*`,
    );
  }

  async findManyByRecipientId(recipientId: string): Promise<Notification[]> {
    const cacheKey = `${CacheKeysPrefix.NOTIFICATION_LIST}:${recipientId}:allNotifications`;

    const cacheHit = await this.cacheRepository.get(cacheKey);

    if (cacheHit) {
      const cacheData = JSON.parse(cacheHit);

      return cacheData.map(PrismaNotificationMapper.toDomain);
    }

    const notifications = await prisma.notification.findMany({
      where: {
        recipientId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    await this.cacheRepository.set(
      cacheKey,
      JSON.stringify(notifications),
      CacheTimeInMinutes.notificationTime,
    );

    return notifications.map(PrismaNotificationMapper.toDomain);
  }
}
