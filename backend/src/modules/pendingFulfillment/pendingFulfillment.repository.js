import PendingFulfillment from "./pendingFulfillment.model.js";

class PendingFulfillmentRepository {
  async create(payload) {
    return await PendingFulfillment.create(payload);
  }

  async findById(id) {
    return await PendingFulfillment.findById(id)
      .populate("sourceRequirement")
      .populate("kitchen")
      .populate("createdBy", "-password")
      .populate("resolvedBy", "-password")
      .populate("items.inventoryId")
      .lean();
  }

  async findByRequirementId(requirementId) {
    return await PendingFulfillment.findOne({
      sourceRequirement: requirementId,
      status: {
        $in: [
          "PENDING",
          "PARTIALLY_FULFILLED",
        ],
      },
    })
      .populate("sourceRequirement")
      .populate("kitchen")
      .populate("createdBy", "-password")
      .populate("items.inventoryId")
      .lean();
  }

  async findActive(filter = {}) {
    return await PendingFulfillment.find({
      ...filter,
      status: {
        $in: [
          "PENDING",
          "PARTIALLY_FULFILLED",
        ],
      },
    })
      .populate("sourceRequirement")
      .populate("kitchen")
      .populate("createdBy", "-password")
      .populate("items.inventoryId")
      .sort({ createdAt: -1 })
      .lean();
  }

  async findAll(filter = {}) {
    return await PendingFulfillment.find(filter)
      .populate("sourceRequirement")
      .populate("kitchen")
      .populate("createdBy", "-password")
      .populate("resolvedBy", "-password")
      .populate("items.inventoryId")
      .sort({ createdAt: -1 })
      .lean();
  }

  async updateById(id, payload) {
    return await PendingFulfillment.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("sourceRequirement")
      .populate("kitchen")
      .populate("createdBy", "-password")
      .populate("resolvedBy", "-password")
      .populate("items.inventoryId")
      .lean();
  }
}

export default new PendingFulfillmentRepository();