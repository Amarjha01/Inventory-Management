import ApiError from "../utils/ApiError.js";

import vehicleRepository from "../repositories/vehicle.repository.js";

import { MESSAGE } from "../constants/responseMessages.js";

class VehicleService {
  async createVehicle(payload) {
    console.log(payload);
    return;
    return await vehicleRepository.create(payload);
  }

  async getVehicles() {
    return await vehicleRepository.findMany({
      isActive: true,
    });
  }

  async getVehicleById(id) {
    const vehicle = await vehicleRepository.findById(id);

    if (!vehicle) {
      throw new ApiError(
        404,

        MESSAGE.NOT_FOUND,
      );
    }

    return vehicle;
  }

  async updateVehicle(id, payload) {
    const vehicle = await vehicleRepository.update(
      id,

      payload,
    );

    if (!vehicle) {
      throw new ApiError(
        404,

        MESSAGE.NOT_FOUND,
      );
    }

    return vehicle;
  }

  async activateVehicle(id) {
    return await vehicleRepository.activate(id);
  }

  async deactivateVehicle(id) {
    return await vehicleRepository.deactivate(id);
  }
}

export default new VehicleService();
