import { body } from "express-validator";

import { ROLE } from "../constants/roles.js";

export const createUserValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),

  body("phone").trim().notEmpty().withMessage("Phone number is required"),

  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role").isIn(Object.values(ROLE)).withMessage("Invalid role"),

  body("language").optional().isIn(["en", "hi"]),

  body("kitchenId").optional().isMongoId().withMessage("Invalid kitchen"),
];

export const updateUserValidator = [
  body("name").optional().trim(),

  body("phone").optional().trim(),

  body("password").optional().isLength({ min: 6 }),

  body("role").optional().isIn(Object.values(ROLE)),

  body("language").optional().isIn(["en", "hi"]),

  body("kitchenId").optional().isMongoId(),
];
