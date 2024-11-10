import { ActivityStatus } from "src/core/entities/activity-status";
import { Entity } from "src/core/entities/entity";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";

export interface ActivityRecordProps {
  staffId: UniqueEntityID;
  status: ActivityStatus;
  dateTimeIso: string;
  commit: string;
}

export class ActivityRecord extends Entity<ActivityRecordProps> {
  get staffId() {
    return this.props.staffId;
  }

  get status() {
    return this.props.status;
  }

  get dateTimeIso() {
    return this.props.dateTimeIso;
  }

  get commit() {
    return this.props.commit;
  }

  static create(props: ActivityRecordProps, id?: UniqueEntityID) {
    return new ActivityRecord(
      {
        ...props,
      },
      id,
    );
  }
}
