import { Notification } from "../../enterprise/entities/notification";

export interface NotificationsRepository {
  findById(id: string): Promise<Notification | null>;
  update(notification: Notification, recipientId: string): Promise<void>;
  create(notification: Notification, recipientId: string): Promise<void>;
  findManyByRecipientId(recipientId: string): Promise<Notification[]>;
}
