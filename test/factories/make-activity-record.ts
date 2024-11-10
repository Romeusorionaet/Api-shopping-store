import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { faker } from "@faker-js/faker";
import {
  ActivityRecord,
  ActivityRecordProps,
} from "src/domain/store/enterprise/entities/activity-record";
import { ActivityStatus } from "src/core/entities/activity-status";

export function makeActivityRecord(
  override: Partial<ActivityRecordProps> = {},
  id?: UniqueEntityID,
) {
  const activityRecord = ActivityRecord.create(
    {
      staffId: new UniqueEntityID(),
      dateTimeIso: new Date().toISOString(),
      status: ActivityStatus.CREATED,
      commit: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return activityRecord;
}
