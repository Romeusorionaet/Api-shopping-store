import { Either, right } from "src/core/either";
import { InvalidTokenError } from "../../errors/invalid-token-error";
import { Encrypter } from "../../../cryptography/encrypter";
import { StaffRepository } from "../../../repositories/staff-repository";

interface RefreshTokenUseCaseRequest {
  userId: string;
  publicId: string;
}

type RefreshTokenUseCaseResponse = Either<
  InvalidTokenError,
  {
    accessToken: string;
    refreshToken: string;
  }
>;

export class RefreshTokenUseCase {
  constructor(
    private encrypter: Encrypter,
    private staffRepository: StaffRepository,
  ) {}

  async execute({
    userId,
    publicId,
  }: RefreshTokenUseCaseRequest): Promise<RefreshTokenUseCaseResponse> {
    const staff = await this.staffRepository.findByUserId(userId);

    const accessToken = await this.encrypter.encryptAccessToken({
      sub: userId,
      staffId: staff?.id.toString() || "",
      role: staff?.role || "",
      publicId,
    });

    const refreshToken = await this.encrypter.encryptRefreshToken({
      sub: userId,
      staffId: staff?.id.toString() || "",
      role: staff?.role || "",
      publicId,
    });

    return right({ accessToken, refreshToken });
  }
}
