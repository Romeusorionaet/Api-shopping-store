import { ActivityRecord } from "../../enterprise/entities/activity-record";

export interface AuditRepository {
  createActivityRecord(data: ActivityRecord): Promise<void>;
}
