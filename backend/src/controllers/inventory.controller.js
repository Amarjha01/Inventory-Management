import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import inventoryService from "../services/inventory.service.js";

import { MESSAGE } from "../constants/responseMessages.js";

export const createInventory = asyncHandler(async (req, res) => {
  const item = await inventoryService.createInventory(req.body);

  return ApiResponse.created(res, MESSAGE.CREATED, item);
});

export const getInventory = asyncHandler(async (req, res) => {
  const inventory = await inventoryService.getInventory();

  return ApiResponse.success(res, MESSAGE.SUCCESS, inventory);
});

export const getInventoryById = asyncHandler(async (req, res) => {
  const item = await inventoryService.getInventoryById(req.params.id);

  return ApiResponse.success(res, MESSAGE.SUCCESS, item);
});

export const updateInventory = asyncHandler(async (req, res) => {
  const item = await inventoryService.updateInventory(req.params.id, req.body);

  return ApiResponse.success(res, MESSAGE.UPDATED, item);
});

export const updateInventoryStock = asyncHandler(async (req, res) => {
  const item = await inventoryService.updateStock(
    req.params.id,
    req.body.quantity,
  );

  return ApiResponse.success(res, "Stock updated successfully", item);
});

export const activateInventory = asyncHandler(async (req, res) => {
  const item = await inventoryService.activateInventory(req.params.id);

  return ApiResponse.success(res, "Inventory activated successfully", item);
});

export const deactivateInventory = asyncHandler(async (req, res) => {
  const item = await inventoryService.deactivateInventory(req.params.id);

  return ApiResponse.success(res, "Inventory deactivated successfully", item);
});
