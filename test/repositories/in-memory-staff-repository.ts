import { StaffRepository } from "src/domain/store/application/repositories/staff-repository";
import { Staff } from "src/domain/store/enterprise/entities/staff";
import { InMemoryUsersRepository } from "./in-memory-users-repository";
import { StaffBasicInfoType } from "src/domain/store/application/repositories/activity-record-repository";

export class InMemoryStaffRepository implements StaffRepository {
  public items: Staff[] = [];

  constructor(private usersRepository: InMemoryUsersRepository) {}

  async findByUserId(id: string): Promise<Staff | null> {
    const staff = this.items.find((staff) => staff.userId.toString() === id);

    if (!staff) {
      return null;
    }

    return staff;
  }

  async findByStaffId(staffId: string): Promise<StaffBasicInfoType> {
    const staff = this.items.find((staff) => staff.id.toString() === staffId);

    const accountable = await this.usersRepository.findById(
      staff!.userId.toString(),
    );

    return {
      role: staff!.role,
      user: {
        username: accountable!.username,
        email: accountable!.email,
      },
    };
  }
}
