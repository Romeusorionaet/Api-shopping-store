import { app } from "./app";
import { env } from "./infra/env";
import "src/infra/service/set-up-socket-io/io";

app
  .listen({
    host: "0.0.0.0",
    port: env.PORT,
  })
  .then(() => {
    console.log("► HTTP Server Running! Port:", env.PORT);
  });
