import { Router } from "express";

import { login, logout } from "../controllers/auth.controller.js";

import { loginValidator } from "../validators/auth.validator.js";
import validate from "../middleware/validate.middleware.js";
const router = Router();

router.post("/login", loginValidator, validate, login);
router.post("/logout", logout);

export default router;
