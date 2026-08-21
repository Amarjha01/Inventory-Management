import { body } from "express-validator";

const requirementSubmissionTimeValidator = () => {
  return body().custom(() => {
    const now = new Date();

    const currentMinutes =
      now.getHours() * 60 + now.getMinutes();

    const startMinutes = 5 * 60;  // 05:00 AM
    const endMinutes = 18 * 60;   // 06:00 PM

    if (
      currentMinutes < startMinutes ||
      currentMinutes > endMinutes
    ) {
      throw new Error(
        "Requirement can only be submitted between 05:00 AM and 06:00 PM."
      );
    }

    return true;
  });
};

export const createRequirementValidator = [
  requirementSubmissionTimeValidator(),

  body("kitchen")
    .notEmpty()
    .withMessage("Kitchen is required"),

  body("remarks")
    .optional()
    .trim(),

  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one item is required"),

  body("items.*.inventoryId")
    .notEmpty()
    .withMessage("Inventory item is required"),

  body("items.*.quantity")
    .isNumeric()
    .withMessage("Quantity must be numeric"),

  body("items.*.unit")
    .trim()
    .notEmpty()
    .withMessage("Unit is required"),
];

export const updateRequirementValidator = [
  body("remarks")
    .optional()
    .trim(),

  body("items")
    .optional()
    .isArray(),
];
