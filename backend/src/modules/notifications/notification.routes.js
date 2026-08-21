import { Router } from "express";

import authenticate from "../../middleware/auth.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import {
  sendAdminNotification,
  subscribe,
  unsubscribe,
} from "./notification.controller.js";

import {
  subscribeValidator,
  unsubscribeValidator,
} from "./notification.validator.js";
import { testNotification } from "../../controllers/testNotification.js";
import authorize from "../../middleware/role.middleware.js";
import { ROLE } from "../../constants/roles.js";

const router = Router();

router.use(authenticate);

router.post(
  "/test",
  testNotification,
);

router.post(
  "/subscribe",
  subscribeValidator,
  validate,
  subscribe,
);

router.post(
  "/unsubscribe",
  unsubscribeValidator,
  validate,
  unsubscribe,
);

router.post(
  "/admin/send",
  authorize(
     ROLE.ADMIN,
     ROLE.STORE_SUPERVISOR
  ),
  sendAdminNotification
)
export default router;