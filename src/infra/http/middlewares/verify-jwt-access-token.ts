import { FastifyReply, FastifyRequest } from "fastify";

export async function verifyJWTAccessToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const result = await request.jwtVerify();
    console.log(result, "===mdat");

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
