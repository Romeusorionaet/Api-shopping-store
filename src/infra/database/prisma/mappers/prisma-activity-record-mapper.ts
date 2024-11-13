import { Prisma, ActivityRecord as PrismaActivityRecord } from "@prisma/client";
import { ActivityStatus } from "src/core/entities/activity-status";
import { EntityType } from "src/core/entities/entity-type";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { ActivityRecord } from "src/domain/store/enterprise/entities/activity-record";

export class PrismaActivityRecordMapper {
  static toDomain(raw: PrismaActivityRecord): ActivityRecord {
    const status: ActivityStatus = raw.status as ActivityStatus;
    const entityType: EntityType = raw.entityType as EntityType;

    return ActivityRecord.create(
      {
        staffId: new UniqueEntityID(raw.staffId),
        entityId: new UniqueEntityID(raw.entityId),
        entityType,
        dateTimeIso: raw.dateTimeIso,
        status,
        commit: raw.commit,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    activityRecord: ActivityRecord,
  ): Prisma.ActivityRecordUncheckedCreateInput {
    return {
      id: activityRecord.id.toString(),
      staffId: activityRecord.staffId.toString(),
      entityId: activityRecord.entityId.toString(),
      entityType: activityRecord.entityType,
      dateTimeIso: activityRecord.dateTimeIso,
      status: activityRecord.status,
      commit: activityRecord.commit,
    };
  }
}
