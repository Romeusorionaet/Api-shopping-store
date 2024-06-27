import { FastifyRequest, FastifyReply } from "fastify";
import { subSchema } from "../../schemas/sub-schema";
import { z } from "zod";
import { makeFetchNotificationsUseCase } from "src/domain/notification/application/use-cases/factory/make-fetch-notifications-use-case";
import { NotificationPresenter } from "../../presenters/notification-presenter";

export async function fetchBuyerNotifications(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { sub: buyerId } = subSchema.parse(request.user);

    const fetchNotificationsUseCase = makeFetchNotificationsUseCase();

    const result = await fetchNotificationsUseCase.execute({
      recipientId: buyerId,
    });

    if (!result.value || result.value.notifications.length === 0) {
      return reply.status(200).send({
        message: "Nem uma notificação foi encontrada.",
        categories: [],
      });
    }

    return reply.status(200).send({
      notifications: result.value.notifications.map(
        NotificationPresenter.toHTTP,
      ),
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error: err.errors[0].message,
        error_path: err.errors[0].path,
      });
    }
  }
}
