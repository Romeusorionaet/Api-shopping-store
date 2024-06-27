import { FastifyRequest, FastifyReply } from "fastify";
import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";
import { subSchema } from "../../schemas/sub-schema";
import { z } from "zod";
import { makeReadNotificationUseCase } from "src/domain/notification/application/use-cases/factory/make-read-notification-use-case";
import { NotAllowedError } from "src/core/errors/not-allowed-error";
import { NotificationPresenter } from "../../presenters/notification-presenter";

const paramsSchema = z.object({
  notificationId: z.string().uuid(),
});

export async function readBuyerNotification(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { sub: buyerId } = subSchema.parse(request.user);
    const { notificationId } = paramsSchema.parse(request.params);

    const readNotificationUseCase = makeReadNotificationUseCase();

    const result = await readNotificationUseCase.execute({
      notificationId,
      recipientId: buyerId,
    });

    if (result.isLeft()) {
      const err = result.value;
      switch (err.constructor) {
        case ResourceNotFoundError:
        case NotAllowedError:
          return reply.status(400).send({
            error: err.message,
          });

        default:
          throw new Error(err.message);
      }
    }

    return reply.status(200).send({
      notification: NotificationPresenter.toHTTP(result.value.notification),
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
