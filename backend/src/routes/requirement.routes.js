import { Router } from "express";

import {
  createRequirement,
  getRequirements,
  getRequirementById,
  getLatestKitchenRequirement,
  updateRequirement,
  dispatchRequirement,
  receiveRequirement,
  getAllKitchenRequirements,
  editGatePass,
  deletteRequirement,
} from "../controllers/requirement.controller.js";

import authenticate from "../middleware/auth.middleware.js";

import authorize from "../middleware/role.middleware.js";

import validate from "../middleware/validate.middleware.js";

import {
  createRequirementValidator,
  updateRequirementValidator,
} from "../validators/requirement.validator.js";

import { ROLE } from "../constants/roles.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

router.use(authenticate);

router.get("/", 
  authorize(
    ROLE.KITCHEN_INCHARGE,
    ROLE.STORE_INCHARGE
  ),
  validate,
  getRequirements);


router.get("/allKitchenRequirements",
  authorize(
    ROLE.ADMIN,
    ROLE.STORE_INCHARGE,
    ROLE.DISTRICT_COORDINATOR
  ),
  validate,
  getAllKitchenRequirements);

router.get("/latest/:kitchenId",
   authorize(
    ROLE.KITCHEN_INCHARGE,
    ROLE.STORE_INCHARGE
  ),
  validate,
  getLatestKitchenRequirement);

router.get("/:id", getRequirementById);

router.post(
  "/",
  authorize(
    ROLE.KITCHEN_INCHARGE,
    ROLE.STORE_INCHARGE
  ),
  createRequirementValidator,
  validate,
  createRequirement,
);

router.patch(
  "/:id",
  authorize(
    ROLE.STORE_SUPERVISOR,
    ROLE.ADMIN,
  ),
  updateRequirementValidator,
  validate,
  updateRequirement,
);

router.patch(
  "/:id/dispatch",
  authorize(
    ROLE.STORE_SUPERVISOR,
    ROLE.ADMIN,
  ),
  dispatchRequirement,
);

router.patch(
  "/:id/receive",
  authorize(
    ROLE.KITCHEN_INCHARGE,
    ROLE.STORE_INCHARGE,
    ROLE.STORE_SUPERVISOR,
    ROLE.ADMIN
  ),
  upload.array("gatePass", 2),
  receiveRequirement
);

router.patch(
  "/:id/gate-pass",
  authorize(
    ROLE.STORE_SUPERVISOR,
    ROLE.ADMIN
  ),
  upload.array("gatePass", 2),
  editGatePass
);

router.delete(
  "/delete-requirement",
  authorize(
    ROLE.ADMIN,
    ROLE.STORE_SUPERVISOR
  ),
  deletteRequirement
)
export default router;
