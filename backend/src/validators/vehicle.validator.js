import { body } from "express-validator";

export const createVehicleValidator = [
  body("vehicleNumber")
    .trim()
    .notEmpty()
    .withMessage("Vehicle number is required"),

  body("vehicleName").trim().notEmpty().withMessage("Vehicle name is required"),

  body("capacity")
    .optional()
    .isNumeric()
    .withMessage("Capacity must be numeric"),
];

export const updateVehicleValidator = [
  body("vehicleNumber").optional(),

  body("vehicleName").optional(),

  body("capacity").optional().isNumeric(),
];
