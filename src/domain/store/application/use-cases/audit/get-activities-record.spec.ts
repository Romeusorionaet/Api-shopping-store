import { makeActivityRecord } from "test/factories/make-activity-record";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { InMemoryActivityRecordRepository } from "test/repositories/in-memory-activity-record-repository";
import { GetActivitiesRecordUseCase } from "./get-activities-record";
import { InMemoryStaffRepository } from "test/repositories/in-memory-staff-repository";
import { InMemoryUsersRepository } from "test/repositories/in-memory-users-repository";
import { makeUser } from "test/factories/make-user";
import { makeStaff } from "test/factories/make-staff";
import { Role } from "src/core/entities/role";

let activityRecordRepository: InMemoryActivityRecordRepository;
let staffRepository: InMemoryStaffRepository;
let usersRepository: InMemoryUsersRepository;
let sut: GetActivitiesRecordUseCase;

describe("Get activities record", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    staffRepository = new InMemoryStaffRepository(usersRepository);
    activityRecordRepository = new InMemoryActivityRecordRepository(
      staffRepository,
    );
    sut = new GetActivitiesRecordUseCase(activityRecordRepository);
  });

  test("should be able get activities record by entityId", async () => {
    const accountable = await makeUser(
      {},
      new UniqueEntityID("accountable-id-test"),
    );

    usersRepository.items.push(accountable);

    const staff = makeStaff(
      { userId: accountable.id, role: Role.ADMIN },
      new UniqueEntityID("staff-id-test"),
    );

    staffRepository.items.push(staff);

    const activityRecord = makeActivityRecord(
      {
        staffId: staff.id,
        entityId: new UniqueEntityID("entity-id-test-01"),
      },
      new UniqueEntityID("activity-record-test-id"),
    );

    activityRecordRepository.items.push(activityRecord);

    const result = await sut.execute({
      id: activityRecord.entityId.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.activityRecordWithStaff).length(1);
    expect(result.value?.activityRecordWithStaff).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          activityRecord: expect.objectContaining({
            id: activityRecord.id,
            entityId: activityRecord.entityId,
          }),
          staff: expect.objectContaining({
            role: staff.role,
            user: expect.objectContaining({
              username: accountable.username,
              email: accountable.email,
            }),
          }),
        }),
      ]),
    );
  });
});
