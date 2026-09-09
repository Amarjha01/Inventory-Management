import Requirement from "../../models/requirement.js";
import PendingFulfillment from "./pendingFulfillment.model.js";

class PendingFulfillmentRepository {
  async create(payload) {
    return await PendingFulfillment.create(payload);
  }

  async findById(id) {
    return await PendingFulfillment.findById(id)
      
      .populate("kitchenId")
      .populate("items.createdBy", "-password")
      .populate("items.resolvedBy", "-password")
      .populate("items.inventoryId")
      .populate("items.referenceToOriginalRequirementId")
      .lean();
  }

  async findByRequirementId(requirementId , filter = {}) {
    return await PendingFulfillment.findOne({
      referenceToOriginalRequirementId: requirementId,
      filter
    })
      .populate("items.referenceToOriginalRequirementId")
      .populate("kitchenId")
      .populate("items.createdBy", "-password")
      .populate("items.inventoryId")
      .lean();
  }
  
  async findByKitchentId(kitchenId , filter = {}) {
    return await PendingFulfillment.findOne({
      kitchenId: kitchenId,
      filter
    })
      .populate("items.referenceToOriginalRequirementId" , "requirementNumber _id")
      .populate("kitchenId" , " name  _id ")
      .populate("items.createdBy", "name _id")
      .populate("items.inventoryId" , "name createAt quantity _id")
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
     .populate("items.referenceToOriginalRequirementId" , "requirementNumber _id")
      .populate("kitchenId" , " name  _id ")
      .populate("items.createdBy", "name _id")
      .populate("items.inventoryId" , "name createAt quantity _id")
      ?.populate("items.fulfilledBy" , "name _id")
      .sort({ createdAt: -1 })
      .lean();
  }

  async findAll(filter = {}) {
    return await PendingFulfillment.find(filter)
      .populate("items.referenceToOriginalRequirementId" , "_id")
      .populate("kitchenId")
      .populate("items.createdBy", "-password")
      .populate("items.fulfilledBy", "name")
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
      .populate("items.referenceToOriginalRequirementId")
      .populate("kitchenId")
      .populate("items.createdBy", "-password")
      .populate("items.resolvedBy", "-password")
      .populate("items.inventoryId")
      .lean();
  }

  async addItem(id, item) {
  return await PendingFulfillment.findByIdAndUpdate(
    id,
    {
      $push: {
        items: item,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .populate("kitchenId")
    .lean();
}

async findUnDispatchedByKitchen(kitchenId) {

  return await Requirement.find({
    kitchen: kitchenId,
    status: {
      $in: ["Submitted"],
    },
  })
    .select("_id requirementNumber items createdBy createdAt")
    .populate("createdBy", "name")
    .populate("kitchen" , "name")
    .sort({
      createdAt: -1,
    })
    .lean()
    .then((requirements) =>
      requirements.map((requirement) => ({
        _id: requirement._id,
        requirementNumber: requirement.requirementNumber,
        totalItems: requirement.items?.length || 0,
        createdBy: requirement.createdBy,
        createdAt: requirement.createdAt,
        kitchen:requirement.kitchen.name,
      })),
    );
    
}

async markItemsFulfilled(
  pendingFulfillmentId,
  updates,
) {
  const pending =
    await PendingFulfillment.findById(
      pendingFulfillmentId,
    );

  if (!pending) {
    return null;
  }

  for (const update of updates) {
    const item = pending.items.id(
      update.pendingItemId,
    );

    if (!item) {
      continue;
    }

    item.fulfillmentStatus = "FULFILLED";

    item.fulfilledAt =
      update.fulfilledAt || new Date();

    item.fulfilledBy =
      update.fulfilledBy;

    item.referenceToDispatchedRequirementId =
      update.referenceToDispatchedRequirementId;
  }

  await pending.save();

  return await PendingFulfillment.findById(
    pendingFulfillmentId,
  )
    .populate("kitchenId")
    .populate(
      "items.createdBy",
      "-password",
    )
    .populate(
      "items.fulfilledBy",
      "-password",
    )
    .populate("items.inventoryId")
    .populate(
      "items.referenceToOriginalRequirementId",
    )
    .populate(
      "items.referenceToDispatchedRequirementId",
    )
    .lean();
}

}

export default new PendingFulfillmentRepository();