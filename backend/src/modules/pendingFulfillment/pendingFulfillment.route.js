import { Router } from "express";

import {
  getPendingFulfillments,
  getPendingFulfillment,
  fulfillPendingItem,
  cancelPendingItem,
  createPendingFulfillment,
  getUndispatchedRequirementId,
  mergeItems,
} from "./pendingFulfillment.controller.js";

import { ROLE } from "../../constants/roles.js";
import authorize from "../../middleware/role.middleware.js";
import authenticate from "../../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

// ======================================================
// CREATE PENDING ITEM
// ======================================================

router.post(
  "/",
  authorize(
    ROLE.ADMIN,
    ROLE.STORE_SUPERVISOR,
  ),
  createPendingFulfillment,
);

// ======================================================
// getUndispatchedRequirementId PENDING ITEM
// ======================================================

router.get(
  "/requirementsByKitchen",
  authorize(
    ROLE.ADMIN,
    ROLE.STORE_SUPERVISOR,
    ROLE.CHIEF_COORDINATOR,
    ROLE.DISTRICT_COORDINATOR
  ),
  getUndispatchedRequirementId,
);

// ======================================================
// getUndispatchedRequirementId PENDING ITEM
// ======================================================

router.post(
  "/mergeItems",
  authorize(
    ROLE.ADMIN,
    ROLE.STORE_SUPERVISOR,
  ),
  mergeItems,
);

// ======================================================
// GET ACTIVE PENDING ITEMS
// ======================================================

router.get(
  "/",
  authorize(
    ROLE.ADMIN,
    ROLE.STORE_INCHARGE,
    ROLE.KITCHEN_INCHARGE,
    ROLE.CHIEF_COORDINATOR,
    ROLE.DISTRICT_COORDINATOR
  ),
  getPendingFulfillments,
);

// ======================================================
// GET ONE KITCHEN'S PENDING FULFILLMENT
// ======================================================

router.get(
  "/:id",
  authorize(
    ROLE.ADMIN,
    ROLE.STORE_INCHARGE,
    ROLE.KITCHEN_INCHARGE,
    ROLE.CHIEF_COORDINATOR,
    ROLE.DISTRICT_COORDINATOR
  ),
  getPendingFulfillment,
);

// ======================================================
// FULFILL ONE PENDING ITEM
// ======================================================

router.patch(
  "/:id/item/fulfill",
  authorize(
    ROLE.ADMIN,
    ROLE.STORE_INCHARGE,
  ),
  fulfillPendingItem,
);

// ======================================================
// CANCEL ONE PENDING ITEM
// ======================================================

router.patch(
  "/:id/item/cancel",
  authorize(
    ROLE.ADMIN,
    ROLE.STORE_INCHARGE,
  ),
  cancelPendingItem,
);

export default router;