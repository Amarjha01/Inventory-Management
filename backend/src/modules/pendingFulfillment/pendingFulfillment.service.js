import ApiError from "../utils/ApiError.js";

import pendingFulfillmentRepository from "./pendingFulfillment.repository.js";

import requirementRepository from "../requirements/requirement.repository.js";

import inventoryRepository from "../inventory/inventory.repository.js";

class PendingFulfillmentService {

  // ======================================================
  // CREATE PENDING FULFILLMENT
  // ======================================================

  async createFromRequirement(
    requirement,
    userId,
  ) {

    const pendingItems = requirement.items
      .filter(
        (item) =>
          Number(item.dispatchedQuantity || 0) <
          Number(item.quantity),
      )
      .map((item) => ({
        inventoryId: item.inventoryId,
        requestedQuantity: item.quantity,
        dispatchedQuantity:
          Number(item.dispatchedQuantity || 0),
        pendingQuantity:
          Number(item.quantity) -
          Number(item.dispatchedQuantity || 0),
        unit: item.unit,
      }));

    if (pendingItems.length === 0) {
      return null;
    }

    const existing =
      await pendingFulfillmentRepository
        .findByRequirementId(
          requirement._id,
        );

    if (existing) {
      throw new ApiError(
        409,
        "Pending fulfillment already exists for this requirement.",
      );
    }

    return await pendingFulfillmentRepository.create({
      sourceRequirement: requirement._id,

      kitchen: requirement.kitchen,

      requirementNumber:
        requirement.requirementNumber,

      items: pendingItems,

      reason: "OUT_OF_STOCK",

      status: "PENDING",

      createdBy: userId,
    });
  }


  // ======================================================
  // GET ACTIVE PENDING
  // ======================================================

  async getPending(filter = {}) {

    return await pendingFulfillmentRepository
      .findActive(filter);
  }


  // ======================================================
  // GET ONE
  // ======================================================

  async getById(id) {

    const pending =
      await pendingFulfillmentRepository
        .findById(id);

    if (!pending) {
      throw new ApiError(
        404,
        "Pending fulfillment not found.",
      );
    }

    return pending;
  }


  // ======================================================
  // FULFILL PENDING ITEMS
  // ======================================================

  async fulfill(
    id,
    items,
    userId,
  ) {

    const pending =
      await pendingFulfillmentRepository
        .findById(id);

    if (!pending) {
      throw new ApiError(
        404,
        "Pending fulfillment not found.",
      );
    }

    if (
      pending.status === "FULFILLED"
    ) {
      throw new ApiError(
        400,
        "This pending fulfillment is already fulfilled.",
      );
    }

    if (
      pending.status === "CANCELLED"
    ) {
      throw new ApiError(
        400,
        "This pending fulfillment has been cancelled.",
      );
    }


    // --------------------------------------------
    // Validate requested quantities
    // --------------------------------------------

    for (const requestedItem of items) {

      const pendingItem =
        pending.items.find(
          (item) =>
            item.inventoryId._id.toString() ===
            requestedItem.inventoryId.toString(),
        );

      if (!pendingItem) {
        throw new ApiError(
          400,
          "Inventory item is not part of this pending fulfillment.",
        );
      }

      const quantity =
        Number(requestedItem.quantity);

      if (
        !Number.isFinite(quantity) ||
        quantity <= 0
      ) {
        throw new ApiError(
          400,
          "Fulfillment quantity must be greater than zero.",
        );
      }

      if (
        quantity >
        pendingItem.pendingQuantity
      ) {
        throw new ApiError(
          400,
          `Cannot fulfill more than pending quantity for ${pendingItem.inventoryId.name}.`,
        );
      }
    }


    // --------------------------------------------
    // Check inventory stock FIRST
    // --------------------------------------------

    for (const requestedItem of items) {

      const inventory =
        await inventoryRepository.findById(
          requestedItem.inventoryId,
        );

      if (!inventory) {
        throw new ApiError(
          404,
          "Inventory not found.",
        );
      }

      if (
        Number(requestedItem.quantity) >
        Number(inventory.quantity)
      ) {
        throw new ApiError(
          400,
          `${inventory.name} has insufficient stock.`,
        );
      }
    }


    // --------------------------------------------
    // Deduct inventory
    // --------------------------------------------

    for (const requestedItem of items) {

      const inventory =
        await inventoryRepository.findById(
          requestedItem.inventoryId,
        );

      inventory.quantity -=
        Number(requestedItem.quantity);

      await inventory.save();
    }


    // --------------------------------------------
    // Update pending quantities
    // --------------------------------------------

    const updatedItems =
      pending.items.map((pendingItem) => {

        const fulfillmentItem =
          items.find(
            (item) =>
              item.inventoryId.toString() ===
              pendingItem.inventoryId._id.toString(),
          );

        if (!fulfillmentItem) {
          return {
            inventoryId:
              pendingItem.inventoryId._id,

            requestedQuantity:
              pendingItem.requestedQuantity,

            dispatchedQuantity:
              pendingItem.dispatchedQuantity,

            pendingQuantity:
              pendingItem.pendingQuantity,

            unit:
              pendingItem.unit,
          };
        }

        const fulfilledQuantity =
          Number(
            fulfillmentItem.quantity,
          );

        const newPendingQuantity =
          pendingItem.pendingQuantity -
          fulfilledQuantity;

        return {
          inventoryId:
            pendingItem.inventoryId._id,

          requestedQuantity:
            pendingItem.requestedQuantity,

          dispatchedQuantity:
            pendingItem.dispatchedQuantity +
            fulfilledQuantity,

          pendingQuantity:
            newPendingQuantity,

          unit:
            pendingItem.unit,
        };
      });


    const allFulfilled =
      updatedItems.every(
        (item) =>
          item.pendingQuantity === 0,
      );

    const newStatus = allFulfilled
      ? "FULFILLED"
      : "PARTIALLY_FULFILLED";


    return await pendingFulfillmentRepository
      .updateById(
        id,
        {
          items: updatedItems,

          status: newStatus,

          ...(allFulfilled
            ? {
                resolvedAt: new Date(),
                resolvedBy: userId,
              }
            : {}),
        },
      );
  }


  // ======================================================
  // CANCEL
  // ======================================================

  async cancel(id, userId) {

    const pending =
      await pendingFulfillmentRepository
        .findById(id);

    if (!pending) {
      throw new ApiError(
        404,
        "Pending fulfillment not found.",
      );
    }

    if (
      pending.status === "FULFILLED"
    ) {
      throw new ApiError(
        400,
        "Fulfilled pending items cannot be cancelled.",
      );
    }

    return await pendingFulfillmentRepository
      .updateById(
        id,
        {
          status: "CANCELLED",
          resolvedAt: new Date(),
          resolvedBy: userId,
        },
      );
  }
}

export default new PendingFulfillmentService();