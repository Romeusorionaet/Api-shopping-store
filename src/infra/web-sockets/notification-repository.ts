interface NotificationProps {
  title: string;
  content: string;
  readAt: Date | boolean;
  createdAt: Date;
}

export interface NotificationForUniqueUserProps {
  userPublicId: string;
  notification: NotificationProps;
}

export interface NotificationRepository {
  emitNotificationForUniqueUser({
    notification,
    userPublicId,
  }: NotificationForUniqueUserProps): void;
}
