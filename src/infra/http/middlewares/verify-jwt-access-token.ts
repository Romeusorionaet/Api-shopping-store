import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyJWTAccessToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify();

    const tokenPayload = request.user as { permissions?: string[] };
    if (
      !tokenPayload.permissions ||
      !tokenPayload.permissions.includes("read")
    ) {
      throw new Error("Token não possui permissão para acessar esta rota.");
    }
  } catch (err) {
    return reply.status(401).send({ message: "Unauthorized." });
  }
}
