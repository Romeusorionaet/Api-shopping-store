import { ActivityRecord } from "../../enterprise/entities/activity-record";

export interface ActivityRecordRepository {
  createActivityRecord(data: ActivityRecord): Promise<void>;
  getByEntityId(entityId: string): Promise<ActivityRecord[]>;
}
