import ApiError from "../utils/ApiError.js";

import driverRepository from "../repositories/driver.repository.js";

import { MESSAGE } from "../constants/responseMessages.js";

class DriverService {
  async createDriver(payload) {
    return await driverRepository.create(payload);
  }

  async getDrivers() {
    return await driverRepository.findMany({
      isActive: true,
    });
  }

  async getDriverById(id) {
    const driver = await driverRepository.findById(id);

    if (!driver) {
      throw new ApiError(
        404,

        MESSAGE.NOT_FOUND,
      );
    }

    return driver;
  }

  async updateDriver(id, payload) {
    const driver = await driverRepository.update(
      id,

      payload,
    );

    if (!driver) {
      throw new ApiError(
        404,

        MESSAGE.NOT_FOUND,
      );
    }

    return driver;
  }

  async activateDriver(id) {
    return await driverRepository.activate(id);
  }

  async deactivateDriver(id) {
    return await driverRepository.deactivate(id);
  }
}

export default new DriverService();
