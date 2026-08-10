import { Server } from "socket.io";

import env from "../config/env.js";

import logger from "../utils/logger.js";

let io = null;

const initializeSocket = (server) => {

    io = new Server(server, {

        cors: {

            origin: env.CLIENT_URL,

            credentials: true

        }

    });

    io.on("connection", (socket) => {

        logger.info(`Socket Connected : ${socket.id}`);

        socket.on("disconnect", () => {

            logger.info(`Socket Disconnected : ${socket.id}`);

        });

    });

    return io;

};

export const getIO = () => {

    if (!io) {

        throw new Error("Socket.io is not initialized.");

    }

    return io;

};

export default initializeSocket;