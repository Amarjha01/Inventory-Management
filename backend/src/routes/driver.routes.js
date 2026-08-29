import { Router } from "express";

import {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  activateDriver,
  deactivateDriver,
} from "../controllers/driver.controller.js";

import authenticate from "../middleware/auth.middleware.js";

import authorize from "../middleware/role.middleware.js";

import validate from "../middleware/validate.middleware.js";

import {
  createDriverValidator,
  updateDriverValidator,
} from "../validators/driver.validator.js";

import { ROLE } from "../constants/roles.js";

const router = Router();

router.use(authenticate);

router.get("/", 
  // authorize(
  //   ROLE.ADMIN,
  //   ROLE.STORE_SUPERVISOR
  // ),
  getDrivers);

router.get("/:id", getDriverById);

router.post(
  "/",

  authorize(
    ROLE.ADMIN,

    ROLE.STORE_SUPERVISOR,
  ),

  createDriverValidator,

  validate,

  createDriver,
);

router.patch(
  "/:id",

  authorize(
    ROLE.ADMIN,

    ROLE.STORE_SUPERVISOR,
  ),

  updateDriverValidator,

  validate,

  updateDriver,
);

router.patch(
  "/:id/activate",

  authorize(ROLE.ADMIN),

  activateDriver,
);

router.patch(
  "/:id/deactivate",

  authorize(ROLE.ADMIN),

  deactivateDriver,
);

export default router;
