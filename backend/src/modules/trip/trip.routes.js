import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import {uploadTripFuel , uploadTripEvidence , uploadTripStart , uploadTripFinal, uploadTripArrival} from "../../middleware/upload.middleware.js";

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
  gpsTrail,
  createGpsTrackingToken
} from "./trip.controller.js";
import gpsTrackingAuth from "../../middleware/gpsTracking.middleware.js";

const router = Router();

// Native Android GPS: scoped Bearer token.
router.post(
  "/:tripId/gpstrail/native",
  gpsTrackingAuth,
  gpsTrail
);

router.use(authMiddleware);

// Driver routes
router.post("/", 
  uploadTripStart.single("startMeter.imageUrl"),
  createTrip);
router.get("/admin/all", getAllTrips);
router.get("/my", getMyTrips);
router.get("/:tripId", getTripById);

router.patch("/:tripId", updateTrip);

router.patch(
  "/:tripId/start",
  startTrip
);

router.patch(
  "/:tripId/location",
  updateCurrentLocation
);

router.post(
  "/:tripId/destinations/:destinationId/arrive",
  uploadTripArrival.fields([
    {
      name: "selfie",
      maxCount: 1,
    },
    {
      name: "meterImage",
      maxCount: 1,
    },
    {
      name: "fuelSlip_0",
      maxCount: 1,
    },
  ]),
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
   uploadTripFuel.single("fuelEntries.slip"),
  submitDestinationEvidence
);

router.post(
  "/:tripId/destinations/:destinationId/fuel",
  uploadTripFuel.single("slip"),
  addFuel
);

router.patch(
  "/:tripId/destinations/:destinationId/complete",
  completeDestination
);

router.post(
  "/:tripId/finalize",
  uploadTripFinal.single("meterImage"),
  finalizeTrip
);

router.post("/:tripId/cancel", cancelTrip);

router.post(
  "/:tripId/gpstrail",
  gpsTrail
)
// router.post('/trips/:tripId/location' )
export default router;
