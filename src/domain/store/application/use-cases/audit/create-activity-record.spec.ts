import { InMemoryAuditRepository } from "test/repositories/in-memory-audit-repository";
import { makeActivityRecord } from "test/factories/make-activity-record";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { CreateActivityRecordUseCase } from "./create-activity-record";

let auditRepository: InMemoryAuditRepository;
let sut: CreateActivityRecordUseCase;

describe("Create activity record", () => {
  beforeEach(() => {
    auditRepository = new InMemoryAuditRepository();
    sut = new CreateActivityRecordUseCase(auditRepository);
  });

  test("should be able create a activity record", async () => {
    const activityRecord = makeActivityRecord(
      {},
      new UniqueEntityID("activity-record-test-id"),
    );

    const result = await sut.execute({
      staffId: activityRecord.staffId.toString(),
      entityId: activityRecord.entityId.toString(),
      entityType: activityRecord.entityType,
      dateTimeIso: activityRecord.dateTimeIso,
      status: activityRecord.status,
      commit: activityRecord.commit,
    });

    expect(result.isRight()).toBe(true);
    expect(auditRepository.items[0]).toEqual(
      expect.objectContaining({
        staffId: activityRecord.staffId,
      }),
    );
  });
});
