import { Router } from "express";

import {
  createInventory,
  getInventory,
  getInventoryById,
  updateInventory,
  updateInventoryStock,
  activateInventory,
  deactivateInventory,
} from "../controllers/inventory.controller.js";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  createInventoryValidator,
  updateInventoryValidator,
} from "../validators/inventory.validator.js";

import { ROLE } from "../constants/roles.js";

const router = Router();

router.use(authenticate);

router.get("/", getInventory);

router.get("/:id", getInventoryById);

router.post(
  "/",
  authorize(ROLE.ADMIN, ROLE.STORE_SUPERVISOR),
  createInventoryValidator,
  validate,
  createInventory,
);

router.patch(
  "/:id",
  authorize(ROLE.ADMIN, ROLE.STORE_SUPERVISOR),
  updateInventoryValidator,
  validate,
  updateInventory,
);

router.patch(
  "/:id/stock",
  authorize(ROLE.ADMIN, ROLE.STORE_SUPERVISOR),
  updateInventoryStock,
);

router.patch("/:id/activate", authorize(ROLE.ADMIN), activateInventory);

router.patch("/:id/deactivate", authorize(ROLE.ADMIN), deactivateInventory);

export default router;
