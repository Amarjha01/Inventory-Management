import express from "express";
import configureApplication from "./config/app.config.js";

import routes from "./routes/index.js";
import errorMiddleware from "./middleware/error.middleware.js";

import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import notificationRoutes from "./modules/notifications/notification.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------------------------------
// Application configuration
// ----------------------------------------

configureApplication(app);

// ----------------------------------------
// Body parsers   
// ----------------------------------------

app.use(express.json({ limit: "500kb" }));
app.use(express.urlencoded({ extended: true }));

// ----------------------------------------
// Cookies
// ----------------------------------------

app.use(cookieParser());

// ----------------------------------------
// EJS
// ----------------------------------------

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// ----------------------------------------
// Static files
// ----------------------------------------

app.use(
    express.static(path.join(__dirname, "../public"))
);

app.use(
  "/api/v1/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )
);


// ----------------------------------------
// API routes
// ----------------------------------------

app.use("/api/v1", routes);

// ----------------------------------------
// Web Push Notification 
// ----------------------------------------

app.use(
  "/api/v1/notifications",
  notificationRoutes,
);
// ----------------------------------------
// 404
// ----------------------------------------

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found",
    });
});

app.use((err, req, res, next) => {
  console.log("Error middleware:", err);

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: err.success ?? false,
    statusCode,
    message: err.message || "Something went wrong",
    errors: err.errors || [],
  });
});

// ----------------------------------------
// Error middleware
// ----------------------------------------

app.use(errorMiddleware);

export default app;