import { body } from "express-validator";

export const subscribeValidator = [
  body("endpoint")
    .isURL()
    .withMessage("Invalid push subscription endpoint"),

  body("keys")
    .isObject()
    .withMessage("Subscription keys are required"),

  body("keys.p256dh")
    .notEmpty()
    .withMessage("p256dh key is required"),

  body("keys.auth")
    .notEmpty()
    .withMessage("auth key is required"),
];


export const unsubscribeValidator = [
  body("endpoint")
    .isURL()
    .withMessage("Invalid push subscription endpoint"),
];

export const sendAdminNotificationValidator = {
  audience: [
    "kitchen",
    "district",
    "all_kitchens",
    "all_users",
  ],

  title: {
    required: true,
    maxLength: 100,
  },

  body: {
    required: true,
    maxLength: 300,
  },
};