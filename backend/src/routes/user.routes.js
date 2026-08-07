import { Router } from "express";

import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  activateUser,
  deactivateUser,
} from "../controllers/user.controller.js";

import authenticate from "../middleware/auth.middleware.js";

import authorize from "../middleware/role.middleware.js";

import validate from "../middleware/validate.middleware.js";

import { ROLE } from "../constants/roles.js";

import {
  createUserValidator,
  updateUserValidator,
} from "../validators/user.validator.js";

const router = Router();

router.use(authenticate);

router.get("/", authorize(ROLE.ADMIN), getUsers);

router.get("/:id", authorize(ROLE.ADMIN), getUserById);

router.post(
  "/",
  authorize(ROLE.ADMIN),
  createUserValidator,
  validate,
  createUser,
);

router.patch(
  "/:id",
  authorize(ROLE.ADMIN),
  updateUserValidator,
  validate,
  updateUser,
);

router.patch("/:id/activate", authorize(ROLE.ADMIN), activateUser);

router.patch("/:id/deactivate", authorize(ROLE.ADMIN), deactivateUser);

export default router;
