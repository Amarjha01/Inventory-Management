import ApiError from "../utils/ApiError.js";

import { MESSAGE } from "../constants/responseMessages.js";

import { REQUIREMENT_STATUS } from "../constants/status.js";

import generateRequirementNumber from "../utils/generateRequirementNumber.js";

import requirementRepository from "../repositories/requirement.repository.js";
import vehicleRepository from "../repositories/vehicle.repository.js";
import inventoryRepository from "../repositories/inventory.repository.js";
import driverRepository from "../repositories/driver.repository.js";
class RequirementService {
  async createRequirement(payload) {
    payload.requirementNumber = generateRequirementNumber();

    return await requirementRepository.create(payload);
  }

  async getRequirements(kitchenId) {
    return await requirementRepository.findMany({ kitchen: kitchenId });
  }
  async allKitchenRequirements() {
    console.log("here API reached");

    return await requirementRepository.findMany();
  }

  async getRequirementById(id) {
    const requirement = await requirementRepository.findById(id);

    if (!requirement) {
      throw new ApiError(
        404,

        MESSAGE.NOT_FOUND,
      );
    }

    return requirement;
  }

  async getLatestKitchenRequirement(kitchenId) {
    return await requirementRepository.findLatestKitchenRequirement(kitchenId);
  }

  async updateRequirement(id, payload) {
    const requirement = await requirementRepository.update(
      id,

      payload,
    );

    if (!requirement) {
      throw new ApiError(
        404,

        MESSAGE.NOT_FOUND,
      );
    }

    return requirement;
  }

  async dispatchRequirement({ requirementId, payload, userId }) {
    console.log("payload at service", payload);

    const requirement = await requirementRepository.findById(requirementId);

    if (!requirement) {
      throw new ApiError(404, "Requirement not found");
    }

    // if (requirement.status !== REQUIREMENT_STATUS.APPROVED) {
    //   throw new ApiError(
    //     400,

    //     "Requirement is not ready for dispatch",
    //   );
    // }

    const vehicle = await this.prepareVehicle(payload);

    const driver = await this.prepareDriver(payload);

    await this.dispatchInventory(payload.items);

    return await requirementRepository.update(
      requirementId,

      {
        status: REQUIREMENT_STATUS.OUT_FOR_DELIVERY,

        remarks: payload.remarks,

        items: payload.items,

        dispatch: {
          vehicle: vehicle?._id,

          driver: driver?._id,

          dispatchedBy: userId,

          dispatchedAt: new Date(),
        },
      },
    );
  }

  async prepareVehicle(payload) {
    if (payload.vehicleId) {
      const VID = payload.vehicleId;
      console.log(VID);

      const vehicle = await vehicleRepository.findById(VID);

      await vehicleRepository.update(
        vehicle._id,

        {
          isActive: false,
        },
      );

      return vehicle;
    }

    let vehicle = await vehicleRepository.findByVehicleNumber(
      payload.manualVehicleNumber,
    );
    console.log(
      "vehicle is 143:",
      vehicle,
      "Number",
      payload.manualVehicleNumber,
    );

    if (!vehicle) {
      vehicle = await vehicleRepository.create({
        vehicleNumber: payload.manualVehicleNumber,

        vehicleName: "Contract Vehicle",

        isAvailable: false,
      });
    } else {
      await vehicleRepository.update(
        vehicle._id,

        {
          isAvailable: false,
        },
      );
    }

    return vehicle;
  }

  async prepareDriver(payload) {
    let driver = await driverRepository.findByPhone(payload.manualDriverPhone);

    if (!driver) {
      driver = await driverRepository.create({
        name: payload.manualDriverName,

        phone: payload.manualDriverPhone,

        licenseNumber: "NA",
      });
    }

    return driver;
  }

  async dispatchInventory(items) {
    for (const item of items) {
      const inventory = await inventoryRepository.findById(item.inventoryId);

      if (!inventory) {
        throw new ApiError(
          404,

          "Inventory not found",
        );
      }

      if (item.dispatchedQuantity > inventory.quantity) {
        throw new ApiError(
          400,

          `${inventory.name} has insufficient stock`,
        );
      }

      await inventoryRepository.update(
        inventory._id,

        {
          quantity: inventory.quantity - item.dispatchedQuantity,
        },
      );

      // await inventory.save();
    }
  }

  async receiveRequirement(id, file, userId) {
    const requirement = await requirementRepository.findById(id);

    if (!requirement) {
      throw new ApiError(404, "Requirement not found");
    }

    if (requirement.status !== REQUIREMENT_STATUS.OUT_FOR_DELIVERY) {
      throw new ApiError(400, "Requirement is not out for delivery.");
    }

    // make vehicle available again

    if (requirement.dispatch.vehicle) {
      await vehicleRepository.update(
        requirement.dispatch.vehicle,

        {
          isAvailable: true,
        },
      );
    }

    // make driver available again

    if (requirement.dispatch.driver) {
      await driverRepository.update(
        requirement.dispatch.driver,

        {
          isAvailable: true,
        },
      );
    }

    return await this.updateRequirement(
      id,

      {
        status: REQUIREMENT_STATUS.RECEIVED,

        receivedAt: new Date(),

        gatePass: {
          image: file.filename,

          uploadedBy: userId,

          uploadedAt: new Date(),
        },
      },
    );
  }
}

export default new RequirementService();
