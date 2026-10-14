import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";

import env from "./env.js";
import logger from "../utils/logger.js";

const configureApplication = (app) => {

    app.use(
    helmet({
        crossOriginResourcePolicy: {
            policy: "cross-origin",
        },
    })
);

const allowedOrigins = [
  "https://esf.axeiro.com",
  "https://localhost", // Capacitor Android
  "http://localhost:5173", // Local Vite development
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests without an Origin header can include native clients.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
  })
);

    app.use(cookieParser());

    app.use(express.json());

    app.use(express.urlencoded({

        extended: true

    }));

    app.use(

        pinoHttp({

            logger

        })

    );

};

export default configureApplication;