import http from "http";

import app from "./app.js";

import env from "./config/env.js";

import connectDatabase from "./config/database.js";

import logger from "./utils/logger.js";

import initializeSocket from "./socket/socket.js";

const startServer = async () => {
  try {
    await connectDatabase();

    const server = http.createServer(app);

    initializeSocket(server);

    server.listen(
      env.PORT,

      () => {
        logger.info(`Server running on http://localhost:${env.PORT}`);
      },
    );
  } catch (error) {
    // console.log(error);
    
    // logger.error({
    //   message: error.message,

    //   stack: error.stack,
    // });

    process.exit(1);
  }
};

startServer();
