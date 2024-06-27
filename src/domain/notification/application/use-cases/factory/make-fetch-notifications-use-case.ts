import { PrismaNotificationsRepository } from "src/infra/database/prisma/repositories/prisma-notifications-repository";
import { FetchNotificationsUseCase } from "../fetch-notifications";

export function makeFetchNotificationsUseCase() {
  const notificationsRepository = new PrismaNotificationsRepository();

  const useCase = new FetchNotificationsUseCase(notificationsRepository);

  return useCase;
}
