/* eslint-disable camelcase */
import { FastifyReply, FastifyRequest } from "fastify";
import jwt, { JwtPayload } from "jsonwebtoken";
import { InvalidCredentialsError } from "src/core/errors/invalid-credentials-errors";
import { makeRegisterUserWithGoogleUseCase } from "src/domain/store/application/use-cases/user/factory/make-register-user-with-google-use-case";
import { makeAuthenticateUserWithGoogleUseCase } from "src/domain/store/application/use-cases/user/factory/make-authenticate-user-with-google-use-case";
import { RefreshTokenWithGooglePresenter } from "src/infra/http/presenters/refresh-token-with-google-presenter";
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
  console.log("===route====");
  const code = request.query.code;

  console.log("=1==success===", code, "===success===");
  try {
    const { id_token, access_token } = await getGoogleOAuthTokens({ code });
    console.log("=2==success===", id_token, access_token, "===success===");

    const googleUser = await getGoogleUser({ id_token, access_token });
    console.log("=3==success===", googleUser, "===success===");

    if (!googleUser.verified_email) {
      return reply.status(403).send("Google account is not verified");
    }

    const registerUserWithGoogleUseCase = makeRegisterUserWithGoogleUseCase();

    const resultRegisterWithGoogle =
      await registerUserWithGoogleUseCase.execute({
        email: googleUser.email,
        username: googleUser.given_name,
      });

    console.log("=4==success===", resultRegisterWithGoogle, "===success===");

    const user = resultRegisterWithGoogle.user;

    const authenticateUserWithGoogleUseCase =
      makeAuthenticateUserWithGoogleUseCase();

    const result = await authenticateUserWithGoogleUseCase.execute({
      userId: user.id.toString(),
    });

    console.log("=5==success===", result, "===success===");

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
      RefreshTokenWithGooglePresenter.toHTTP(result.value.refreshToken);

    const accessTokenForDecode = result.value.accessToken;

    const decodedToken = jwt.decode(accessTokenForDecode) as DecodedAccessToken;

    const accessTokenExpires = decodedToken.exp;

    reply.cookie("@shopping-store/AT.2.0", result.value.accessToken, {
      expires: new Date(accessTokenExpires * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: "shopping-store-kappa.vercel.app",
      path: "/",
    });

    reply.cookie("@shopping-store/RT.2.0", refreshToken, {
      expires: new Date(refreshTokenExpires * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: "shopping-store-kappa.vercel.app",
      path: "/",
    });

    return reply.redirect(env.SHOPPING_STORE_URL_WEB);
  } catch (err) {
    console.log(err, "=====err=====end");
    return reply.status(500).send("Failed to process Google OAuth login");
  }
}
