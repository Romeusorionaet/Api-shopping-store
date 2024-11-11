import { AuditRepository } from "src/domain/store/application/repositories/audit-repository";
import { ActivityRecord } from "src/domain/store/enterprise/entities/activity-record";
import { prisma } from "src/infra/service/setup-prisma/prisma";
import { PrismaActivityRecordMapper } from "../mappers/prisma-activity-record-mapper";

export class PrismaAuditRepository implements AuditRepository {
  async createActivityRecord(data: ActivityRecord): Promise<void> {
    const activityRecord = PrismaActivityRecordMapper.toPrisma(data);

    await prisma.activityRecord.create({
      data: activityRecord,
    });
  }
}
