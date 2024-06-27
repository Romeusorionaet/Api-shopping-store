import { io } from "src/app";

interface NotificationProps {
  title: string;
  content: string;
  readAt: Date | boolean;
  createdAt: Date;
}

interface OrderPlaceProps {
  userPublicId: string;
  notification: NotificationProps;
}

export class NotificationService {
  emitOrderPlacedNotification({ userPublicId, notification }: OrderPlaceProps) {
    io.to(userPublicId).emit("message", notification);
  }
}
