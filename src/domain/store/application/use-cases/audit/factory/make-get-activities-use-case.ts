import { PrismaActivityRecordRepository } from "src/infra/database/prisma/repositories/prisma-activity-record-repository";
import { GetActivitiesRecordUseCase } from "../get-activities-record";

export function makeGetActivityRecordUseCase() {
  const activityRecordRepository = new PrismaActivityRecordRepository();
  const useCase = new GetActivitiesRecordUseCase(activityRecordRepository);

  return useCase;
}
