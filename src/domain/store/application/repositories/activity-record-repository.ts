import { ActivityRecord } from "../../enterprise/entities/activity-record";

export type StaffBasicInfoType = {
  role: string;
  user: {
    username: string;
    email: string;
  };
};

export type ActivityRecordWithStaffType = {
  activityRecord: ActivityRecord;
  staff: StaffBasicInfoType;
};

export interface ActivityRecordRepository {
  create(data: ActivityRecord): Promise<void>;
  getActivityRecordWithStaffByEntityId(
    entityId: string,
  ): Promise<ActivityRecordWithStaffType[]>;
}
