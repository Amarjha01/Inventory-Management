import notificationService from "../modules/notifications/notification.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const testNotification = asyncHandler(
  async (req, res) => {

    const result =
      await notificationService.sendToUser(
        req.user._id,
        {
          title: "ESF Test Notification",

          body: "Web Push notifications are working.",

          data: {
            url: "/",
          },
        },
      );

    return ApiResponse.success(
      res,
      "Test notification sent",
      result,
    );
  },
);