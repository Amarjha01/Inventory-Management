import { Router } from "express";
import authMiddleware from "../../middleware/auth.middleware.js";
import {uploadTripFuel , uploadTripEvidence , uploadTripStart , uploadTripFinal, uploadTripArrival, uploadTripCompletion} from "../../middleware/upload.middleware.js";

import {
  createTrip,
  getMyTrips,
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
  createGpsTrackingToken,

  getAllTrips,
  getAdminTripSummary,
  getAdminTripById,
  getAdminTripGpsTrail,
  completeTrip,
} from "./trip.controller.js";
import gpsTrackingAuth from "../../middleware/gpsTracking.middleware.js";
import authorizeRoles from "../../middleware/role.middleware.js";
import { ROLE } from "../../constants/roles.js";
const router = Router();

// Native Android GPS: scoped Bearer token.
router.post(
  "/:tripId/gpstrail/native",
  gpsTrackingAuth,
  gpsTrail
);



router.use(authMiddleware);

router.post(
  "/:tripId/gpstrail/token",
  createGpsTrackingToken
);
// Driver routes
router.post("/", 
  uploadTripStart.single("startMeter.imageUrl"),
  createTrip);


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
  "/:tripId/destinations/:destinationId/fuel",
  uploadTripFuel.single("slip"),
  addFuel
);

router.patch(
  "/:tripId/destinations/:destinationId/complete",
  completeDestination
);

router.patch(
  "/:tripId/complete",
  completeTrip
);

router.post(
  "/:tripId/finalize",
  uploadTripFinal.single("meterImage"),
  finalizeTrip
);

router.post("/:tripId/cancel", cancelTrip);


// ADMMIN

// Admin tracking routes
router.get(
  "/admin/trips",
  authorizeRoles(ROLE.ADMIN),
  getAllTrips
);

router.get(
  "/admin/trips/summary",
  authorizeRoles(ROLE.ADMIN),
  getAdminTripSummary
);

router.get(
  "/admin/trips/:tripId/gpstrail",
  authorizeRoles(ROLE.ADMIN),
  getAdminTripGpsTrail
);

router.get(
  "/admin/trips/:tripId",
  authorizeRoles(ROLE.ADMIN),
  getAdminTripById
);

// router.patch("admin/:tripId", )

// router.delete("/admin/:tripId" , )

export default router;
