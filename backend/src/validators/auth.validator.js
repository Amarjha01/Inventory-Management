import { body } from "express-validator";

export const loginValidator = [

    body("phone")
    .trim()
    .matches(/^\d{10}$/)
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("any")
    .withMessage("Invalid phone number"),

    body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")

];