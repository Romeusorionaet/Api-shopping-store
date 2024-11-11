import { StaffRepository } from "src/domain/store/application/repositories/staff-repository";
import { Staff } from "src/domain/store/enterprise/entities/staff";

export class InMemoryStaffRepository implements StaffRepository {
  public items: Staff[] = [];
  async findByUserId(id: string): Promise<Staff | null> {
    const staff = this.items.find((staff) => staff.userId.toString() === id);

    if (!staff) {
      return null;
    }

    return staff;
  }
}
