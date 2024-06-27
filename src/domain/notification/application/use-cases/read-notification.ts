import { Either, left, right } from "src/core/either";
import { NotificationsRepository } from "../repositories/notification-repository";
import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";
import { NotAllowedError } from "src/core/errors/not-allowed-error";
import { Notification } from "src/domain/notification/enterprise/entities/notification";

interface ReadNotificationUseCaseRequest {
  recipientId: string;
  notificationId: string;
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { notification: Notification }
>;

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId);

    if (!notification) {
      return left(new ResourceNotFoundError());
    }

    if (recipientId !== notification.recipientId.toString()) {
      return left(new NotAllowedError());
    }

    if (!notification.readAt) {
      notification.read();

      await this.notificationsRepository.update(notification, recipientId);
    }

    return right({ notification });
  }
}
