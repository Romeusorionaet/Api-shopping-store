/* eslint-disable camelcase */
import { FastifyReply, FastifyRequest } from "fastify";
import jwt, { JwtPayload } from "jsonwebtoken";
import { InvalidCredentialsError } from "src/core/errors/invalid-credentials-errors";
import { makeRegisterUserWithGoogleUseCase } from "src/domain/store/application/use-cases/user/factory/make-register-user-with-google-use-case";
import { makeAuthenticateUserWithGoogleUseCase } from "src/domain/store/application/use-cases/user/factory/make-authenticate-user-with-google-use-case";
import { getGoogleOAuthTokens } from "src/infra/service/gateway-tokens/oauth-google/get-google-oauthTokens";
import { getGoogleUser } from "src/infra/service/gateway-tokens/oauth-google/get-google-user";
import { env } from "src/infra/env";

interface DecodedAccessToken extends JwtPayload {
  exp: number;
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

    const accessTokenForDecode = result.value.accessToken;
    const decodedAccessToken = jwt.decode(
      accessTokenForDecode,
    ) as DecodedAccessToken;
    const accessTokenExpires = decodedAccessToken.exp;

    const refreshTokenForDecode = result.value.refreshToken;
    const decodedRefreshToken = jwt.decode(
      refreshTokenForDecode,
    ) as DecodedAccessToken;
    const refreshTokenExpires = decodedRefreshToken.exp;

    return reply
      .setCookie("@shopping-store/AT.2.0", result.value.accessToken, {
        expires: new Date(accessTokenExpires * 1000),
      })
      .setCookie("@shopping-store/RT.2.0", result.value.refreshToken, {
        expires: new Date(refreshTokenExpires * 1000),
      })
      .redirect(env.SHOPPING_STORE_URL_WEB);
  } catch (err: any) {
    return reply
      .status(500)
      .send(`Failed to process Google OAuth login. ${err.message}`);
  }
}
