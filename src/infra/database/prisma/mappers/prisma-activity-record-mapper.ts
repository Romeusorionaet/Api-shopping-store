import { Prisma, ActivityRecord as PrismaActivityRecord } from "@prisma/client";
import { ActivityStatus } from "src/core/entities/activity-status";
import { EntityType } from "src/core/entities/entity-type";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import {
  ActivityRecordWithStaffType,
  StaffBasicInfoType,
} from "src/domain/store/application/repositories/activity-record-repository";
import { ActivityRecord } from "src/domain/store/enterprise/entities/activity-record";

export class PrismaActivityRecordMapper {
  static toDomain(
    raw: PrismaActivityRecord & {
      staff: StaffBasicInfoType;
    },
  ): ActivityRecordWithStaffType {
    const status: ActivityStatus = raw.status as ActivityStatus;
    const entityType: EntityType = raw.entityType as EntityType;

    const activityRecord = ActivityRecord.create(
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

    return {
      activityRecord,
      staff: {
        role: raw.staff.role,
        user: {
          username: raw.staff.user.username,
          email: raw.staff.user.email,
        },
      },
    };
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
