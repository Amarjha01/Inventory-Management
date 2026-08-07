import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";

import env from "./env.js";
import logger from "../utils/logger.js";

const configureApplication = (app) => {

    app.use(helmet());

    app.use(cors({

        origin: env.CLIENT_URL,

        credentials: true

    }));

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