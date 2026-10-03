// DGMonitoring.routes.js
import express from "express";

import {
    startDG,
    stopDG,
    getActiveDG,
    getDGHistory,
    getLatestDGSession,
    addDG,
    getAllDG,
    getDailyRuntime,
} from "./DGMonitoring.controller.js";

const router = express.Router();

// Add New DG
router.post(
    "/add",
    addDG
);

router.get(
    "/all",
    getAllDG
);

router.get(
    "/daily-runtime",
    getDailyRuntime
);

// Start DG
router.post(
    "/:DGID/start",
    startDG
);


// Stop DG
router.post(
    "/:DGID/stop",
    stopDG
);


// Get currently running session
router.get(
    "/:DGID/active",
    getActiveDG
);


// Get DG run history
router.get(
    "/:DGID/history",
    getDGHistory
);


// Get latest session
router.get(
    "/:DGID/latest",
    getLatestDGSession
);


export default router;