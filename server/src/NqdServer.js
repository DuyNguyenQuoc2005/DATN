import { createServer } from "node:http";
import { Server } from "socket.io";

import app from "./NqdApp.js";
import { env } from "./config/NqdEnv.js";
import { connectDatabase } from "./config/NqdDatabase.js";

const startServer = async () => {
  await connectDatabase();

  const httpServer = createServer(app);

  new Server(httpServer, {
    cors: {
      origin: env.clientOrigin
    }
  });

  httpServer.listen(env.port, () => {
    console.log(`Server đang chạy tại cổng ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Không thể khởi động server:", error.message);

  process.exit(1);
});