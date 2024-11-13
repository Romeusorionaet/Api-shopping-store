import { ActivityRecord } from "../../enterprise/entities/activity-record";

export interface ActivityRecordRepository {
  create(data: ActivityRecord): Promise<void>;
  getByEntityId(entityId: string): Promise<ActivityRecord[]>;
}
