import { Staff } from "../../enterprise/entities/staff";

export interface StaffRepository {
  findByUserId(id: string): Promise<Staff | null>;
}
