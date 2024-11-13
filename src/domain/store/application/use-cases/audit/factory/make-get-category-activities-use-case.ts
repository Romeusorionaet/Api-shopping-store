import { PrismaActivityRecordRepository } from "src/infra/database/prisma/repositories/prisma-activity-record-repository";
import { GetCategoryActivitiesRecordUseCase } from "../get-category-activities-record";

export function makeGetCategoryActivityRecordUseCase() {
  const activityRecordRepository = new PrismaActivityRecordRepository();
  const useCase = new GetCategoryActivitiesRecordUseCase(
    activityRecordRepository,
  );

  return useCase;
}
