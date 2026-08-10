import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import kitchenService from "../services/kitchen.service.js";

import { MESSAGE } from "../constants/responseMessages.js";

export const createKitchen = asyncHandler(async (req, res) => {
  const kitchen = await kitchenService.createKitchen(req.body);

  return ApiResponse.created(
    res,

    MESSAGE.CREATED,

    kitchen,
  );
});

export const getKitchens = asyncHandler(async (req, res) => {
  const kitchens = await kitchenService.getKitchens();

  return ApiResponse.success(
    res,

    MESSAGE.SUCCESS,

    kitchens,
  );
});

export const getKitchenById = asyncHandler(async (req, res) => {
  const kitchen = await kitchenService.getKitchenById(req.params.id);

  return ApiResponse.success(
    res,

    MESSAGE.SUCCESS,

    kitchen,
  );
});

export const updateKitchen = asyncHandler(async (req, res) => {
  const kitchen = await kitchenService.updateKitchen(
    req.params.id,

    req.body,
  );

  return ApiResponse.success(
    res,

    MESSAGE.UPDATED,

    kitchen,
  );
});

export const deactivateKitchen = asyncHandler(async (req, res) => {
  const kitchen = await kitchenService.deactivateKitchen(req.params.id);

  return ApiResponse.success(
    res,

    "Kitchen deactivated successfully",

    kitchen,
  );
});

export const activateKitchen = asyncHandler(async (req, res) => {
  const kitchen = await kitchenService.activateKitchen(req.params.id);

  return ApiResponse.success(
    res,

    "Kitchen activated successfully",

    kitchen,
  );
});
