import { body } from "express-validator";

export const createRequirementValidator = [
  body("kitchen").notEmpty().withMessage("Kitchen is required"),

  body("remarks").optional().trim(),

  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one item is required"),

  body("items.*.inventoryId")
    .notEmpty()
    .withMessage("Inventory item is required"),

  body("items.*.quantity").isNumeric().withMessage("Quantity must be numeric"),

  body("items.*.unit").trim().notEmpty().withMessage("Unit is required"),
];

export const updateRequirementValidator = [
  body("remarks").optional().trim(),

  body("items").optional().isArray(),
];
