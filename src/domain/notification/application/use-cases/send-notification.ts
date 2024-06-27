import { NotificationsRepository } from "../repositories/notification-repository";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Notification } from "src/domain/notification/enterprise/entities/notification";

export interface SendNotificationUseCaseRequest {
  recipientId: string;
  title: string;
  content: string;
}

export type SendNotificationUseCaseResponse = { notification: Notification };

export class SendNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      title,
      content,
    });

    await this.notificationsRepository.create(notification);

    return { notification };
  }
}
