import ApiError from "../utils/ApiError.js";

import { MESSAGE } from "../constants/responseMessages.js";

import { REQUIREMENT_STATUS } from "../constants/status.js";

import generateRequirementNumber from "../utils/generateRequirementNumber.js";

import requirementRepository from "../repositories/requirement.repository.js";

class RequirementService {
  async createRequirement(payload) {
    payload.requirementNumber = generateRequirementNumber();

    return await requirementRepository.create(payload);
  }

  async getRequirements(kitchenId) {
    return await requirementRepository.findMany({kitchen:kitchenId});
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

  async dispatchRequirement(
    id,

    vehicle,

    driver,

    userId,
  ) {
    return await this.updateRequirement(
      id,

      {
        status: REQUIREMENT_STATUS.OUT_FOR_DELIVERY,

        dispatch: {
          vehicle,

          driver,

          dispatchedBy: userId,

          dispatchedAt: new Date(),
        },
      },
    );
  }

  async receiveRequirement(id) {
    return await this.updateRequirement(
      id,

      {
        status: REQUIREMENT_STATUS.RECEIVED,

        receivedAt: new Date(),
      },
    );
  }
}

export default new RequirementService();
