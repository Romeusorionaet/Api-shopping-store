import { Notification } from "src/domain/notification/enterprise/entities/notification";

export class NotificationPresenter {
  static toHTTP(notification: Notification) {
    return {
      id: notification.id.toString(),
      title: notification.title,
      content: notification.content,
      createdAt: notification.createdAt,
      readAt: notification.readAt ? notification.readAt : false,
    };
  }
}
