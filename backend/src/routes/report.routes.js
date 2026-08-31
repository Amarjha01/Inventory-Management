import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

import { ROLE } from "../constants/roles.js";

import {
  downloadRequirementReport,
  getRequirementReportOptions,
} from "../controllers/report.controller.js";

const router = Router();

router.use(authenticate);

router.get(
  "/requirements/report-options",
  authorize(
    ROLE.ADMIN,
    ROLE.STORE_SUPERVISOR,
    ROLE.DISTRICT_COORDINATOR
  ),
  getRequirementReportOptions,
);

router.get(
  "/requirements/report",
  authorize(
    ROLE.ADMIN,
    ROLE.STORE_SUPERVISOR,
    ROLE.DISTRICT_COORDINATOR
  ),
  downloadRequirementReport,
);

export default router;
