import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import vehicleService from "../services/vehicle.service.js";

import { MESSAGE } from "../constants/responseMessages.js";

export const createVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.createVehicle(req.body);

  return ApiResponse.created(
    res,

    MESSAGE.CREATED,

    vehicle,
  );
});

export const getVehicles = asyncHandler(async (req, res) => {
  const vehicles = await vehicleService.getVehicles();

  return ApiResponse.success(
    res,

    MESSAGE.SUCCESS,

    vehicles,
  );
});

export const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.getVehicleById(req.params.id);

  return ApiResponse.success(
    res,

    MESSAGE.SUCCESS,

    vehicle,
  );
});

export const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.updateVehicle(
    req.params.id,

    req.body,
  );

  return ApiResponse.success(
    res,

    MESSAGE.UPDATED,

    vehicle,
  );
});

export const activateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.activateVehicle(req.params.id);

  return ApiResponse.success(
    res,

    "Vehicle activated successfully",

    vehicle,
  );
});

export const deactivateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await vehicleService.deactivateVehicle(req.params.id);

  return ApiResponse.success(
    res,

    "Vehicle deactivated successfully",

    vehicle,
  );
});
