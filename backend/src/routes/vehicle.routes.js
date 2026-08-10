import { Router } from "express";

import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  activateVehicle,
  deactivateVehicle,
} from "../controllers/vehicle.controller.js";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  createVehicleValidator,
  updateVehicleValidator,
} from "../validators/vehicle.validator.js";

import { ROLE } from "../constants/roles.js";

const router = Router();

router.use(authenticate);

router.get(
  "/",

  getVehicles,
);

router.get(
  "/:id",

  getVehicleById,
);

router.post(
  "/",

  authorize(
    ROLE.ADMIN,

    ROLE.STORE_SUPERVISOR,
  ),

  createVehicleValidator,

  validate,

  createVehicle,
);

router.patch(
  "/:id",

  authorize(
    ROLE.ADMIN,

    ROLE.STORE_SUPERVISOR,
  ),

  updateVehicleValidator,

  validate,

  updateVehicle,
);

router.patch(
  "/:id/activate",

  authorize(ROLE.ADMIN),

  activateVehicle,
);

router.patch(
  "/:id/deactivate",

  authorize(ROLE.ADMIN),

  deactivateVehicle,
);

export default router;
