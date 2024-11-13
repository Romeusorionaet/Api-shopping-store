import { PrismaActivityRecordRepository } from "src/infra/database/prisma/repositories/prisma-activity-record-repository";
import { CreateActivityRecordUseCase } from "../create-activity-record";

export function makeCreateActivityRecordUseCase() {
  const activityRecordRepository = new PrismaActivityRecordRepository();
  const useCase = new CreateActivityRecordUseCase(activityRecordRepository);

  return useCase;
}
