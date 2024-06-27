import { ReadNotificationUseCase } from "./read-notification";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { makeNotification } from "test/factories/make-notification";
import { NotAllowedError } from "src/core/errors/not-allowed-error";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase;

describe("Read Notification", () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository);
  });

  test("should be able to read a notification", async () => {
    const notification = makeNotification();

    inMemoryNotificationsRepository.create(notification);

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
      expect.any(Date),
    );
  });

  test("should not be able to read a notification from another user", async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityID("recipient-1"),
    });

    await inMemoryNotificationsRepository.create(notification);

    const result = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: "recipient-2",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
