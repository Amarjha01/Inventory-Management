import express from "express";

import configureApplication from "./config/app.config.js";

import routes from "./routes/index.js";

import errorMiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import path from "path";
const app = express();

configureApplication(app);

app.use(express.json({limit:'500kb'}))
app.use(cookieParser())

app.use(
    cors({
    credentials: true,
    origin: ['http://localhost:5173','http://localhost:5000']
})
)
app.use("/api/v1", routes);

app.use(

    "/uploads",

    express.static(

        path.resolve("uploads")

    )

);
app.use((req, res) => {
  res.status(404).json({
    success: false,

    message: "Route Not Found",
  });
});

app.use(errorMiddleware);

export default app;
