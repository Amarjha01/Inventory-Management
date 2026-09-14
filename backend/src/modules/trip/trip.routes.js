import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import {uploadTripFuel , uploadTripEvidence , uploadTripStart , uploadTripFinal} from "../../middleware/upload.middleware.js";

import {
  createTrip,
  getMyTrips,
  getAllTrips,
  getTripById,
  updateTrip,
  startTrip,
  updateCurrentLocation,
  arriveAtDestination,
  submitDestinationEvidence,
  addFuel,
  completeDestination,
  finalizeTrip,
  cancelTrip,
} from "./trip.controller.js";

const router = Router();

router.use(authMiddleware);

// Driver routes
router.post("/", createTrip);
router.get("/admin/all", getAllTrips);
router.get("/my", getMyTrips);
router.get("/:tripId", getTripById);

router.patch("/:tripId", updateTrip);

router.post(
  "/:tripId/start",
  uploadTripStart.single("meterImage"),
  startTrip
);

router.post(
  "/:tripId/location",
  updateCurrentLocation
);

router.post(
  "/:tripId/destinations/:destinationId/arrive",
  arriveAtDestination
);

router.post(
  "/:tripId/destinations/:destinationId/evidence",
  uploadTripEvidence.fields([
    {
      name: "selfie",
      maxCount: 1,
    },
    {
      name: "meterImage",
      maxCount: 1,
    },
  ]),
  submitDestinationEvidence
);

router.post(
  "/:tripId/destinations/:destinationId/fuel",
  uploadTripFuel.single("slip"),
  addFuel
);

router.post(
  "/:tripId/destinations/:destinationId/complete",
  completeDestination
);

router.post(
  "/:tripId/finalize",
  uploadTripFinal.single("meterImage"),
  finalizeTrip
);

router.post("/:tripId/cancel", cancelTrip);

export default router;
