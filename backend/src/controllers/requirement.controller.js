import asyncHandler from "../utils/asyncHandler.js";

import ApiResponse from "../utils/ApiResponse.js";

import requirementService from "../services/requirement.service.js";

import { MESSAGE } from "../constants/responseMessages.js";

export const createRequirement = asyncHandler(async (req, res) => {
  const requirement = await requirementService.createRequirement(req.body);

  return ApiResponse.created(
    res,

    MESSAGE.CREATED,

    requirement,
  );
});

export const getRequirements = asyncHandler(async (req, res) => {
  
  const requirements = await requirementService.getRequirements(req.user.kitchenId._id);

  return ApiResponse.success(
    res,

    MESSAGE.SUCCESS,

    requirements,
  );
});
export const getAllKitchenRequirements = asyncHandler(async (req, res) => {
  console.log("here API reached1");
  const requirements = await requirementService.allKitchenRequirements();
  console.log(requirements);
  
  return ApiResponse.success(
    res,

    MESSAGE.SUCCESS,

    requirements,
  );
});

export const getRequirementById = asyncHandler(async (req, res) => {
  const requirement = await requirementService.getRequirementById(
    req.params.id,
  );

  return ApiResponse.success(
    res,

    MESSAGE.SUCCESS,

    requirement,
  );
});

export const getLatestKitchenRequirement = asyncHandler(async (req, res) => {
  const requirement = await requirementService.getLatestKitchenRequirement(
    req.params.kitchenId,
  );

  return ApiResponse.success(
    res,

    MESSAGE.SUCCESS,

    requirement,
  );
});

export const updateRequirement = asyncHandler(async (req, res) => {
  const requirement = await requirementService.updateRequirement(
    req.params.id,

    req.body,
  );

  return ApiResponse.success(
    res,

    MESSAGE.UPDATED,

    requirement,
  );
});

export const dispatchRequirement = asyncHandler(async (req, res) => {
  const requirement = await requirementService.dispatchRequirement(
    req.params.id,

    req.body.vehicle,

    req.body.driver,

    req.user._id,
  );
  console.log(req.params);
  
console.log(req.body);

  return ApiResponse.success(
    res,

    "Requirement dispatched successfully",

    requirement,
  );
});

export const receiveRequirement = asyncHandler(async (req, res) => {
  const requirement = await requirementService.receiveRequirement(
    req.params.id,
  );

  return ApiResponse.success(
    res,

    "Requirement received successfully",

    requirement,
  );
});
