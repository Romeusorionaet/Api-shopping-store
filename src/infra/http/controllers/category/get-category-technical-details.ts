import { FastifyRequest, FastifyReply } from "fastify";
import { CategoryPresenter } from "../../presenters/category-presenter";
import { ResourceNotFoundError } from "src/core/errors/resource-not-found-error";
import { makeGetCategoryDetailsUseCase } from "src/domain/store/application/use-cases/category/factory/make-get-category-details-use-case";
import { categoryIdParamsSchema } from "../../schemas/category-id-params-schema";
import { makeGetCategoryActivityRecordUseCase } from "src/domain/store/application/use-cases/audit/factory/make-get-category-activities-use-case";
import { z } from "zod";
import { ActivityRecordPresenter } from "../../presenters/activity-record-presenter";

export async function getCategoryTechnicalDetails(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const { categoryId } = categoryIdParamsSchema.parse(request.params);

    const getCategoryDetailsUseCase = makeGetCategoryDetailsUseCase();

    const categoryBasicDetailsResult = await getCategoryDetailsUseCase.execute({
      id: categoryId,
    });

    if (categoryBasicDetailsResult.isLeft()) {
      const err = categoryBasicDetailsResult.value;
      if (err instanceof ResourceNotFoundError) {
        return reply.status(400).send({
          error: err.message,
        });
      }
      throw new Error(err);
    }

    const getCategoryActivityRecordUseCase =
      makeGetCategoryActivityRecordUseCase();

    const categoryActivityRecordResult =
      await getCategoryActivityRecordUseCase.execute({
        id: categoryId,
      });

    if (
      categoryActivityRecordResult.value?.categoryActivityRecord.length === 0
    ) {
      return reply.status(200).send({
        message: "No categories found.",
        categories: [],
      });
    }

    return reply.status(200).send({
      categoryBasicInformation: CategoryPresenter.toHTTP(
        categoryBasicDetailsResult.value.category,
      ),
      categoryTechnicalDetails:
        categoryActivityRecordResult.value?.categoryActivityRecord.map(
          ActivityRecordPresenter.toHTTP,
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
