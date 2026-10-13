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
    updateDGHealth,
    getDGHealth,
} from "./DGMonitoring.controller.js";

const router = express.Router();


router.post("/voltage", async (req, res) => {
    console.log("Device data:", req.body);

    res.json({
        success: true,
        received: true
    });
});

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

// Post DG Health
router.post(
    "/:DGID/health",
    updateDGHealth
)

// Get DG Health
router.get(
    "/:DGID/health",
    getDGHealth
)

export default router;