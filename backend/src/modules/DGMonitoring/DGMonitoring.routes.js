// DGMonitoring.routes.js
import express from "express";

import {
    startDG,
    stopDG,
    getActiveDG,
    getDGHistory,
    getLatestDGSession,
} from "./DGMonitoring.controller.js";

const router = express.Router();

router.post("/voltage", async (req, res) => {
    console.log("Device data:", req.body);

    res.json({
        success: true,
        received: true
    });
});


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