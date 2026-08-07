import asyncHandler from "../utils/asyncHandler.js";

import ApiResponse from "../utils/ApiResponse.js";

import driverService from "../services/driver.service.js";

import { MESSAGE } from "../constants/responseMessages.js";

export const createDriver = asyncHandler(async (req, res) => {
  const driver = await driverService.createDriver(req.body);

  return ApiResponse.created(
    res,

    MESSAGE.CREATED,

    driver,
  );
});

export const getDrivers = asyncHandler(async (req, res) => {
  const drivers = await driverService.getDrivers();

  return ApiResponse.success(
    res,

    MESSAGE.SUCCESS,

    drivers,
  );
});

export const getDriverById = asyncHandler(async (req, res) => {
  const driver = await driverService.getDriverById(req.params.id);

  return ApiResponse.success(
    res,

    MESSAGE.SUCCESS,

    driver,
  );
});

export const updateDriver = asyncHandler(async (req, res) => {
  const driver = await driverService.updateDriver(
    req.params.id,

    req.body,
  );

  return ApiResponse.success(
    res,

    MESSAGE.UPDATED,

    driver,
  );
});

export const activateDriver = asyncHandler(async (req, res) => {
  const driver = await driverService.activateDriver(req.params.id);

  return ApiResponse.success(
    res,

    "Driver activated successfully",

    driver,
  );
});

export const deactivateDriver = asyncHandler(async (req, res) => {
  const driver = await driverService.deactivateDriver(req.params.id);

  return ApiResponse.success(
    res,

    "Driver deactivated successfully",

    driver,
  );
});
