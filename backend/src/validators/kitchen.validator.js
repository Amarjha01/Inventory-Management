import { body } from "express-validator";

export const createKitchenValidator = [
  body("district").trim().notEmpty().withMessage("District is required"),

  body("name").trim().notEmpty().withMessage("Kitchen name is required"),

  body("address").trim().notEmpty().withMessage("Address is required"),

  body("contactPerson")
    .trim()
    .notEmpty()
    .withMessage("Contact person is required"),

  body("phone").trim().notEmpty().withMessage("Phone number is required"),
];

export const updateKitchenValidator = [
  body("district").optional().trim(),

  body("name").optional().trim(),

  body("address").optional().trim(),

  body("contactPerson").optional().trim(),

  body("phone").optional().trim(),
];
