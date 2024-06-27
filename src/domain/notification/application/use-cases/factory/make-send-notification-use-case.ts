import { PrismaNotificationsRepository } from "src/infra/database/prisma/repositories/prisma-notifications-repository";
import { SendNotificationUseCase } from "../send-notification";

export function makeSendNotificationUseCase() {
  const notificationsRepository = new PrismaNotificationsRepository();

  const useCase = new SendNotificationUseCase(notificationsRepository);

  return useCase;
}
