import asyncHandler from "../utils/asyncHandler.js";

import ApiResponse from "../utils/ApiResponse.js";

import requirementService from "../services/requirement.service.js";

import { MESSAGE } from "../constants/responseMessages.js";

export const createRequirement = asyncHandler(async (req, res) => {
  console.log("req.body at controller creat requirememnt" , req.body);
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
  console.log(req.user);
  
  const filter =
    req.user.role === 'district coordinator' || req.user.role === 'Chief Coordinator'
      ? { district: req.user.district }
      : {};

  const requirements = await requirementService.allKitchenRequirements(filter);

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
   console.log("payload for update quantity" , req.body);
 const payload = {
    $push: {
      items: {
        $each: req.body,
      },
    },
  };
 

  const requirement = await requirementService.updateRequirement(
    req.params.id,

    payload
  );

  return ApiResponse.success(
    res,

    MESSAGE.UPDATED,

    requirement,
  );
});

export const dispatchRequirement = asyncHandler(async (req, res) => {

    try {
      const requirement = await requirementService.dispatchRequirement({

        requirementId: req.params.id,

        payload: req.body,

        userId: req.user._id

    });

    return ApiResponse.success(

        res,

        "Requirement dispatched successfully",

        requirement

    );
    } catch (error) {
      console.error(error);
    }

});

export const receiveRequirement = asyncHandler(async (req, res) => {
  const requirement = await requirementService.receiveRequirement(
    req.params.id,
    req.files,
    req.user._id
  );

  return ApiResponse.success(
    res,
    "Requirement received successfully",
    requirement,
  );
});

export const editGatePass = asyncHandler(async (req, res) => {
  const requirement = await requirementService.editGatePass(
    req.params.id,
    req.files,
    req.user._id
  );

  return ApiResponse.success(
    res,
    "Gate pass images updated successfully",
    requirement,
  );
});

export const deletteRequirement = asyncHandler(async (req, res) => {
  console.log("id to delete" , req.body);
  
  const deletedRequirement = await requirementService.delete(
    req.body.id
  );

  return ApiResponse.success(
    res,
    "Requirement deleted successfully",
    deletedRequirement,
  );
});
