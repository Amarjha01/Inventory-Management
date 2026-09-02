import { Router } from "express";

import {
  getPendingFulfillments,
  getPendingFulfillment,
  fulfillPendingFulfillment,
  cancelPendingFulfillment,
} from "./pendingFulfillment.controller.js";

import authorize from "../middleware/authorize.middleware.js";

import {
  ROLE,
} from "../constants/roles.js";

const router = Router();


// ======================================================
// GET ACTIVE PENDING
// ======================================================

router.get(
  "/",
  authorize(
    ROLE.ADMIN,
    ROLE.STORE_INCHARGE,
    ROLE.KITCHEN_INCHARGE,
  ),
  getPendingFulfillments,
);


// ======================================================
// GET ONE
// ======================================================

router.get(
  "/:id",
  authorize(
    ROLE.ADMIN,
    ROLE.STORE_INCHARGE,
    ROLE.KITCHEN_INCHARGE,
  ),
  getPendingFulfillment,
);


// ======================================================
// FULFILL
// ======================================================

router.patch(
  "/:id/fulfill",
  authorize(
    ROLE.ADMIN,
    ROLE.STORE_INCHARGE,
  ),
  fulfillPendingFulfillment,
);


// ======================================================
// CANCEL
// ======================================================

router.patch(
  "/:id/cancel",
  authorize(
    ROLE.ADMIN,
    ROLE.STORE_INCHARGE,
  ),
  cancelPendingFulfillment,
);


export default router;