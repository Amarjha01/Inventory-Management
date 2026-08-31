import { Router } from "express";

import {
  createKitchen,
  getKitchens,
  getKitchenById,
  updateKitchen,
  activateKitchen,
  deactivateKitchen,
} from "../controllers/kitchen.controller.js";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  createKitchenValidator,
  updateKitchenValidator,
} from "../validators/kitchen.validator.js";

import { ROLE } from "../constants/roles.js";

const router = Router();

router.use(authenticate);

router.get("/",
  authorize(
    ROLE.ADMIN, 
    ROLE.STORE_SUPERVISOR,  
    ROLE.KITCHEN_INCHARGE, 
    ROLE.STORE_SUPERVISOR),
    getKitchens);

router.get("/:id", getKitchenById);

router.post(
  "/",
  authorize(ROLE.ADMIN),
  createKitchenValidator,
  validate,
  createKitchen,
);

router.patch(
  "/:id",
  authorize(ROLE.ADMIN),
  updateKitchenValidator,
  validate,
  updateKitchen,
);

router.patch("/:id/activate", authorize(ROLE.ADMIN), activateKitchen);

router.patch("/:id/deactivate", authorize(ROLE.ADMIN), deactivateKitchen);

export default router;
