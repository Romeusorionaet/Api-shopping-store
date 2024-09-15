import { app } from "./app";
import "src/infra/service/set-up-socket-io/io";
import { env } from "./env";

app
  .listen({
    host: "0.0.0.0",
    port: env.PORT,
  })
  .then(() => {
    console.log("► HTTP Server Running! Port:", env.PORT);
  });
