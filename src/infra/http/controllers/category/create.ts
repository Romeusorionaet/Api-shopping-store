import { FastifyRequest, FastifyReply } from "fastify";
import { makeCreateCategoryUseCase } from "src/domain/store/application/use-cases/category/factory/make-create-category-use-case";
import { CategoryAlreadyExistsError } from "src/domain/store/application/use-cases/errors/category-already-exists-error";
import { z } from "zod";
import { categoryCreateSchema } from "../../schemas/category-schema";
import { makeCreateActivityRecordUseCase } from "src/domain/store/application/use-cases/audit/factory/make-activity-record-use-case";
import { EntityType } from "src/core/entities/entity-type";
import { ActivityStatus } from "src/core/entities/activity-status";
import { subAdminSchema } from "../../schemas/sub-admin-schema";

export async function create(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { staffId } = subAdminSchema.parse(request.user);

    const { imgUrl, title, commit } = categoryCreateSchema.parse(request.body);

    const createCategoryUseCase = makeCreateCategoryUseCase();

    const result = await createCategoryUseCase.execute({ imgUrl, title });

    if (result.isLeft()) {
      const err = result.value;
      switch (err.constructor) {
        case CategoryAlreadyExistsError:
          return reply.status(400).send({
            error: err.message,
          });

        default:
          throw new Error(err.message);
      }
    }

    const createActivityRecordUseCase = makeCreateActivityRecordUseCase();

    await createActivityRecordUseCase.execute({
      staffId,
      entityId: result.value.category.id.toString(),
      entityType: EntityType.CATEGORY,
      dateTimeIso: result.value.category.createdAt.toString(),
      status: ActivityStatus.CREATED,
      commit,
    });

    return reply.status(201).send({ message: "Categoria criado com sucesso!" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(400).send({
        error: err.errors[0].message,
        error_path: err.errors[0].path,
      });
    }
  }
}
