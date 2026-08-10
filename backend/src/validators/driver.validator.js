import { body } from "express-validator";

export const createDriverValidator = [
  body("name").trim().notEmpty().withMessage("Driver name is required"),

  body("phone").trim().notEmpty().withMessage("Phone number is required"),

  body("licenseNumber")
    .trim()
    .notEmpty()
    .withMessage("License number is required"),
];

export const updateDriverValidator = [
  body("name").optional(),

  body("phone").optional(),

  body("licenseNumber").optional(),

  body("address").optional(),

  body("remarks").optional(),
];
