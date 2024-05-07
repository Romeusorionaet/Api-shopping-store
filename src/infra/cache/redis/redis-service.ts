import Redis from "ioredis";
import { env } from "src/infra/env";

export class RedisService extends Redis {
  constructor() {
    super({ host: env.REDIS_HOST, port: env.REDIS_PORT, db: env.REDIS_DB });
  }
}
