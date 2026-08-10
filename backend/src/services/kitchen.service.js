import ApiError from "../utils/ApiError.js";

import kitchenRepository from "../repositories/kitchen.repository.js";

import { MESSAGE } from "../constants/responseMessages.js";

class KitchenService {
  async createKitchen(payload) {
    return await kitchenRepository.create(payload);
  }

  async getKitchens() {
    return await kitchenRepository.findMany({
      isActive: true,
    });
  }

  async getKitchenById(id) {
    const kitchen = await kitchenRepository.findById(id);

    if (!kitchen) {
      throw new ApiError(
        404,

        MESSAGE.NOT_FOUND,
      );
    }

    return kitchen;
  }

  async updateKitchen(id, payload) {
    const kitchen = await kitchenRepository.update(
      id,

      payload,
    );

    if (!kitchen) {
      throw new ApiError(
        404,

        MESSAGE.NOT_FOUND,
      );
    }

    return kitchen;
  }

  async deactivateKitchen(id) {
    const kitchen = await kitchenRepository.deactivate(id);

    if (!kitchen) {
      throw new ApiError(
        404,

        MESSAGE.NOT_FOUND,
      );
    }

    return kitchen;
  }

  async activateKitchen(id) {
    const kitchen = await kitchenRepository.activate(id);

    if (!kitchen) {
      throw new ApiError(
        404,

        MESSAGE.NOT_FOUND,
      );
    }

    return kitchen;
  }
}

export default new KitchenService();
