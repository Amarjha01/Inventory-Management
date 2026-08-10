import ApiError from "../utils/ApiError.js";

import inventoryRepository from "../repositories/inventory.repository.js";

import { MESSAGE } from "../constants/responseMessages.js";

class InventoryService {
  async createInventory(payload) {
    return await inventoryRepository.create(payload);
  }

  async getInventory() {
    return await inventoryRepository.findMany({
      // isActive: true,
    });
  }

  async getInventoryById(id) {
    const item = await inventoryRepository.findById(id);

    if (!item) {
      throw new ApiError(404, MESSAGE.NOT_FOUND);
    }

    return item;
  }

  async updateInventory(id, payload) {
    const item = await inventoryRepository.update(id, payload);

    if (!item) {
      throw new ApiError(404, MESSAGE.NOT_FOUND);
    }

    return item;
  }

  async updateStock(id, quantity) {
    const item = await inventoryRepository.updateStock(id, quantity);

    if (!item) {
      throw new ApiError(404, MESSAGE.NOT_FOUND);
    }

    return item;
  }

  async activateInventory(id) {
    const item = await inventoryRepository.activate(id);

    if (!item) {
      throw new ApiError(404, MESSAGE.NOT_FOUND);
    }

    return item;
  }

  async deactivateInventory(id) {
    const item = await inventoryRepository.deactivate(id);

    if (!item) {
      throw new ApiError(404, MESSAGE.NOT_FOUND);
    }

    return item;
  }
}

export default new InventoryService();
