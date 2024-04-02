/* eslint-disable camelcase */
import { FastifyReply, FastifyRequest } from "fastify";
import jwt, { JwtPayload } from "jsonwebtoken";
import { InvalidCredentialsError } from "src/core/errors/invalid-credentials-errors";
import { makeRegisterUserWithGoogleUseCase } from "src/domain/store/application/use-cases/user/factory/make-register-user-with-google-use-case";
import { makeAuthenticateUserWithGoogleUseCase } from "src/domain/store/application/use-cases/user/factory/make-authenticate-user-with-google-use-case";
import { getGoogleOAuthTokens } from "src/infra/http/service/get-google-oauthTokens";
import { getGoogleUser } from "src/infra/http/service/get-google-user";
import { RefreshTokenPresenter } from "src/infra/http/presenters/refresh-token-presenter";

interface DecodedAccessToken extends JwtPayload {
  exp?: number;
}

export async function registerWithGoogle(
  request: FastifyRequest<{
    Querystring: {
      code: string;
    };
  }>,
  reply: FastifyReply,
) {
  const code = request.query.code;

  try {
    const { id_token, access_token } = await getGoogleOAuthTokens({ code });

    const googleUser = await getGoogleUser({ id_token, access_token });

    if (!googleUser.verified_email) {
      return reply.status(403).send("Google account is not verified");
    }

    const registerUserWithGoogleUseCase = makeRegisterUserWithGoogleUseCase();

    const resultRegisterWithGoogle =
      await registerUserWithGoogleUseCase.execute({
        email: googleUser.email,
        username: googleUser.given_name,
      });

    const user = resultRegisterWithGoogle.user;

    const authenticateUserWithGoogleUseCase =
      makeAuthenticateUserWithGoogleUseCase();

    const result = await authenticateUserWithGoogleUseCase.execute({
      userId: user.id.toString(),
    });

    if (result.isLeft()) {
      const err = result.value;
      switch (err.constructor) {
        case InvalidCredentialsError:
          return reply.status(400).send({
            error: err.message,
          });

        default:
          throw new Error(err.message);
      }
    }

    const { id: refreshToken, expires: refreshTokenExpires } =
      RefreshTokenPresenter.toHTTP(result.value.refreshToken);

    const accessTokenForDecode = result.value.accessToken;

    const decodedToken = jwt.decode(accessTokenForDecode) as DecodedAccessToken;

    const accessTokenExpires = decodedToken?.exp;

    reply.cookie("accessToken", result.value.accessToken, {
      expires: accessTokenExpires
        ? new Date(accessTokenExpires * 1000)
        : undefined,
      httpOnly: true,
      secure: true,
      domain: "localhost",
      path: "/",
    });

    reply.cookie("refreshToken", refreshToken, {
      expires: new Date(refreshTokenExpires * 1000),
      httpOnly: true,
      secure: true,
      domain: "localhost",
      path: "/",
    });

    return reply.redirect("http://localhost:3000");
  } catch (error) {
    return reply.status(500).send("Failed to process Google OAuth login");
  }
}
