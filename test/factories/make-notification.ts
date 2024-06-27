import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import {
  Notification,
  NotificationProps,
} from "src/domain/notification/enterprise/entities/notification";
import { PrismaNotificationMapper } from "src/infra/database/prisma/mappers/prisma-notification-mapper";
import { prisma } from "src/infra/service/setup-prisma/prisma";

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityID,
) {
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityID(),
      title: faker.lorem.sentence(4),
      content: faker.lorem.sentence(10),
      ...override,
    },
    id,
  );

  return notification;
}

export class NotificationFactory {
  async makePrismaNotification(
    data: Partial<NotificationProps> = {},
  ): Promise<Notification> {
    const notification = makeNotification(data);

    await prisma.notification.create({
      data: PrismaNotificationMapper.toPrisma(notification),
    });

    return notification;
  }
}
