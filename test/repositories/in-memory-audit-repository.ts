import { AuditRepository } from "src/domain/store/application/repositories/audit-repository";
import { ActivityRecord } from "src/domain/store/enterprise/entities/activity-record";

export class InMemoryAuditRepository implements AuditRepository {
  public items: ActivityRecord[] = [];
  async createActivityRecord(data: ActivityRecord): Promise<void> {
    this.items.push(data);
  }
}
