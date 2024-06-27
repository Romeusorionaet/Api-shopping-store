import { Either, right } from "src/core/either";
import { NotificationsRepository } from "../repositories/notification-repository";
import { Notification } from "src/domain/notification/enterprise/entities/notification";

interface FetchNotificationsUseCaseRequest {
  recipientId: string;
}

type FetchNotificationsUseCaseResponse = Either<
  null,
  { notifications: Notification[] }
>;

export class FetchNotificationsUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
  }: FetchNotificationsUseCaseRequest): Promise<FetchNotificationsUseCaseResponse> {
    const notifications =
      await this.notificationsRepository.findManyByRecipientId(recipientId);

    return right({ notifications });
  }
}
