import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

import notificationService from "./notification.service.js";


export const subscribe = asyncHandler(
  async (req, res) => {

    const subscription =
      await notificationService.subscribe(
        req.user._id,
        req.body,
        req.headers["user-agent"],
      );

    return ApiResponse.success(
      res,
      "Push notification subscribed successfully",
      subscription,
    );
  },
);


export const unsubscribe = asyncHandler(
  async (req, res) => {

    await notificationService.unsubscribe(
      req.user._id,
      req.body.endpoint,
    );

    return ApiResponse.success(
      res,
      "Push notification unsubscribed successfully",
    );
  },
);

export const sendAdminNotification = async (req, res) => {
  try {
    console.log("send notification at controller" , req.body);
    
    const result =
      await notificationService.sendAdminNotification(
        req.body
      );

    return res.status(200).json({
      message: "Notification sent successfully",
      data: result,
    });
  } catch (error) {
    console.error(
      "Admin notification error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to send notification",
    });
  }
};