import Requirement from "../models/requirement.js";

class ReportRepository {

    async getRequirements(filter) {

        return Requirement.find(filter)

            .populate("kitchen")

            .populate("createdBy")

            .populate("items.inventoryId")

            .populate("dispatch.vehicle")

            .populate("dispatch.driver")

            .sort({

                createdAt: 1,

            })

            .lean();

    }

}

export default new ReportRepository();