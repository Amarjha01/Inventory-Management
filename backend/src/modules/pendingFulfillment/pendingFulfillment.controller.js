import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import pendingFulfillmentService from "./pendingFulfillment.service.js";


// ======================================================
// GET ACTIVE PENDING FULFILLMENTS
// ======================================================

export const getPendingFulfillments =
  asyncHandler(async (req, res) => {

    const filter = {};

    if (req.query.kitchen) {
      filter.kitchen = req.query.kitchen;
    }

    const pending =
      await pendingFulfillmentService
        .getPending(filter);

    return ApiResponse.success(
      res,
      "Pending fulfillments fetched successfully",
      pending,
    );
  });


// ======================================================
// GET ONE
// ======================================================

export const getPendingFulfillment =
  asyncHandler(async (req, res) => {

    const pending =
      await pendingFulfillmentService
        .getById(req.params.id);

    return ApiResponse.success(
      res,
      "Pending fulfillment fetched successfully",
      pending,
    );
  });


// ======================================================
// FULFILL
// ======================================================

export const fulfillPendingFulfillment =
  asyncHandler(async (req, res) => {

    const pending =
      await pendingFulfillmentService.fulfill(
        req.params.id,

        req.body.items,

        req.user._id,
      );

    return ApiResponse.success(
      res,
      "Pending fulfillment updated successfully",
      pending,
    );
  });

// ======================================================
// CANCEL
// ======================================================

export const cancelPendingFulfillment =
  asyncHandler(async (req, res) => {

    const pending =
      await pendingFulfillmentService.cancel(
        req.params.id,
        req.user._id,
      );

    return ApiResponse.success(
      res,
      "Pending fulfillment cancelled successfully",
      pending,
    );
  });