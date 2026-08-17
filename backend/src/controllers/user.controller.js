import asyncHandler from "../utils/asyncHandler.js";

import ApiResponse from "../utils/ApiResponse.js";

import userService from "../services/user.service.js";

import { MESSAGE } from "../constants/responseMessages.js";
import userRepository from "../repositories/user.repository.js";

export const createUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  
  const user = await userService.createUser(req.body);

  return ApiResponse.created(res, MESSAGE.CREATED, user);
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.getUsers();

  return ApiResponse.success(res, MESSAGE.SUCCESS, users);
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  return ApiResponse.success(res, MESSAGE.SUCCESS, user);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);

  return ApiResponse.success(res, MESSAGE.UPDATED, user);
});

export const activateUser = asyncHandler(async (req, res) => {
  const user = await userService.activateUser(req.params.id);

  return ApiResponse.success(res, "User activated successfully", user);
});

export const deactivateUser = asyncHandler(async (req, res) => {
  const user = await userService.deactivateUser(req.params.id);

  return ApiResponse.success(res, "User deactivated successfully", user);
});
