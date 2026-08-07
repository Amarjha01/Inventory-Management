import { body } from "express-validator";

export const createInventoryValidator = [
  body("name").trim().notEmpty().withMessage("Material name is required"),

  body("hindiName").trim().notEmpty().withMessage("Hindi name is required"),

  body("quantity")
    .isFloat({ min: 0 })
    .withMessage("Quantity must be greater than or equal to 0"),

  body("unit").trim().notEmpty().withMessage("Unit is required"),

  body("minimumStock")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum stock must be greater than or equal to 0"),

  body("image").optional().trim(),
];

export const updateInventoryValidator = [
  body("name").optional().trim(),

  body("hindiName").optional().trim(),

  body("quantity").optional().isFloat({ min: 0 }),

  body("unit").optional().trim(),

  body("minimumStock").optional().isFloat({ min: 0 }),

  body("image").optional().trim(),
];
