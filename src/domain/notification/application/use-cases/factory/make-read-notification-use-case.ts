import { PrismaNotificationsRepository } from "src/infra/database/prisma/repositories/prisma-notifications-repository";
import { ReadNotificationUseCase } from "../read-notification";

export function makeReadNotificationUseCase() {
  const notificationsRepository = new PrismaNotificationsRepository();

  const useCase = new ReadNotificationUseCase(notificationsRepository);

  return useCase;
}
