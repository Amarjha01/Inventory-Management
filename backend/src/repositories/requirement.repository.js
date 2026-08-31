import Kitchen from "../models/kitchen.js";
import Requirement from "../models/requirement.js";

class RequirementRepository {
async create(payload) {
  const requirement = await Requirement.create(payload);

  await requirement.populate("kitchen");

  return requirement;
}

 async findMany(filter = {}) {
  let requirementFilter = filter;

  if (filter.district) {
    const kitchens = await Kitchen.find({
      district: filter.district,
    }).select("_id").lean();

    requirementFilter.kitchen = {
      $in: kitchens.map((kitchen) => kitchen._id),
    };
  }

  return await Requirement.find(requirementFilter)
    .populate("kitchen")
    .populate("createdBy", "-password")
    .populate("items.inventoryId")
    .populate("dispatch.vehicle")
    .populate("dispatch.driver")
    .sort({
      createdAt: -1,
    })
    .lean();
}


  async findById(id) {
    return await Requirement.findById(id)

      .populate("kitchen")

      .populate("createdBy", "-password")

      .populate("items.inventoryId")

      .populate("dispatch.vehicle")

      .populate("dispatch.driver")

      .populate("dispatch.dispatchedBy" , "-password")

      .populate("dispatch.dispatchedAt")

      .lean();
  }

  async update(id, payload) {
    console.log("id and payload at repositories" , id , payload);
    
    return await Requirement.findByIdAndUpdate(
      id,

      payload,

      {
        new: true,

        runValidators: true,
      },
    )

      .populate("kitchen")

      .populate("createdBy", "-password")

      .populate("items.inventoryId")

      .populate("dispatch.vehicle")

      .populate("dispatch.driver")

      .lean();
  }

  async findLatestKitchenRequirement(kitchenId) {
    return await Requirement.findOne({
      kitchen: kitchenId,
      status: { $in: ["Out For Delivery", "Submitted"] }
    })

      .sort({
        createdAt: -1,
      })

      .populate("createdBy", "name")

      .populate("kitchen" , "address")

      .populate("items.inventoryId")

      .populate("dispatch.vehicle")

      .populate("dispatch.driver")

      .lean();
  }

  async findByIdAndDelete(id){
    return await Requirement.findByIdAndDelete(id)
  }
}

export default new RequirementRepository();
