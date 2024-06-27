import { io } from "src/app";
import {
  NotificationForUniqueUserProps,
  NotificationRepository,
} from "../notification-repository";

export class IOEmitNotificationRepository implements NotificationRepository {
  emitNotificationForUniqueUser({
    notification,
    userPublicId,
  }: NotificationForUniqueUserProps): void {
    io.to(userPublicId).emit("message", notification);
  }
}
