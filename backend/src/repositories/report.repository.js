import Requirement from "../models/requirement.js";

class ReportRepository {
  async getRequirements(filter) {
    return Requirement.find(filter)
      .populate("kitchen", "_id name district")
      .populate("createdBy", "_id name")
      .populate(
        "items.inventoryId",
        "_id name",
      )
      .populate(
        "dispatch.vehicle",
        "_id vehicleNumber",
      )
      .populate(
        "dispatch.driver",
        "_id name",
      )
      .sort({
        createdAt: 1,
      });
  }
}

export default new ReportRepository();
