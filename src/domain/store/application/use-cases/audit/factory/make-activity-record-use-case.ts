import { PrismaAuditRepository } from "src/infra/database/prisma/repositories/prisma-audit-repository";
import { CreateActivityRecordUseCase } from "../create-activity-record";

export function makeCreateActivityRecordUseCase() {
  const auditRepository = new PrismaAuditRepository();
  const useCase = new CreateActivityRecordUseCase(auditRepository);

  return useCase;
}
