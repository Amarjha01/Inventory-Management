import express from "express";

import {
  getLiveLocations,
  getLiveLocationsByVehicle,
} from "./tracking.controller.js";
import validateTrackerRequirement from "../../validators/tracker.validator.js";
import authorize from "../../middleware/role.middleware.js";
import { ROLE } from "../../constants/roles.js";
import authenticate from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.middleware.js";

const router = express.Router();
router.use(authenticate);
router.get(
  "/live-all",
  authorize(ROLE.ADMIN , ROLE.STORE_SUPERVISOR),
  validate,
  getLiveLocations
);
router.get(
  "/live-by-vehicle",
  authorize(
    ROLE.ADMIN, 
    ROLE.KITCHEN_INCHARGE, 
    ROLE.STORE_INCHARGE, 
    ROLE.STORE_SUPERVISOR, 
    ROLE.DISTRICT_COORDINATOR
  ),
  validateTrackerRequirement,
  validate,
  getLiveLocationsByVehicle
);

export default router;