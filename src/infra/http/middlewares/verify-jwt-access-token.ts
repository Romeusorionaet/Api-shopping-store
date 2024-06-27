import { FastifyReply, FastifyRequest } from "fastify";

interface JwtPayload {
  sub: string;
  publicId: string;
  permissions: string[];
  iat?: number;
  exp?: number;
}

export async function verifyJWTAccessToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const payload = await request.jwtVerify<JwtPayload>();

    const permissions = payload.permissions;

    if (!permissions || !permissions.includes("read")) {
      return reply.status(401).send({
        error: "Token não possui permissão para acessar esta rota.",
      });
    }
  } catch (err) {
    return reply.status(401).send({ error: "Não autorizado." });
  }
}
