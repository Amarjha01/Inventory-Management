import { Router } from "express";

import { changePassword, login, logout } from "../controllers/auth.controller.js";

import { loginValidator } from "../validators/auth.validator.js";
import validate from "../middleware/validate.middleware.js";
import authenticate from "../middleware/auth.middleware.js";
const router = Router();

router.post("/login", loginValidator, validate, login);
router.post("/logout", logout);
router.use(authenticate);
router.post("/setNewPassword",  changePassword);

export default router;
