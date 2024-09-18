import { makeSendNotificationUseCase } from "src/domain/notification/application/use-cases/factory/make-send-notification-use-case";
import { IOEmitNotificationRepository } from "src/infra/web-sockets/socket-io/io-notification-repository";
import { NotificationPresenter } from "../presenters/notification-presenter";

interface NotificationProcessProps {
  publicId: string;
  buyerId: string;
  formattedNotification: {
    title: string;
    content: string;
  };
}

export async function makeNotificationProcess({
  publicId,
  buyerId,
  formattedNotification,
}: NotificationProcessProps) {
  const sendNotificationUseCase = makeSendNotificationUseCase();

  const resultNotification = await sendNotificationUseCase.execute({
    recipientId: buyerId,
    title: formattedNotification.title,
    content: formattedNotification.content,
  });

  const notification = resultNotification.notification;

  const IONotify = new IOEmitNotificationRepository();

  IONotify.emitNotificationForUniqueUser({
    userPublicId: publicId,
    notification: NotificationPresenter.toHTTP(notification),
  });
}
