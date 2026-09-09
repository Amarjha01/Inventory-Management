import pendingFulfillmentRepository from "./pendingFulfillment.repository.js";

import ApiError from "../../utils/ApiError.js";
import inventoryRepository from "../../repositories/inventory.repository.js";
import requirementRepository from "../../repositories/requirement.repository.js";
import Kitchen from "../../models/kitchen.js";

class PendingFulfillmentService {
  // ======================================================
  // CREATE PENDING FULFILLMENT
  // ======================================================

  async createFromRequirement(requirement, user) {
    console.log(requirement);

    // 1. Make sure the requirement exists
    if (!requirement?._id) {
      throw new ApiError(400, "Requirement ID is required.");
    }

    // 2. Validate the item information
    if (!requirement.inventoryId) {
      throw new ApiError(400, "Inventory ID is required.");
    }

    if (!requirement.quantity || requirement.quantity <= 0) {
      throw new ApiError(400, "Valid quantity is required.");
    }

    if (!requirement.unit) {
      throw new ApiError(400, "Unit is required.");
    }

    const existingKitchen = await pendingFulfillmentRepository.findByKitchentId(
      requirement.kitchenId,
    );

    // 3. Check whether a PendingFulfillment already exists
    const existing = await pendingFulfillmentRepository.findByRequirementId(
      requirement._id,
    );

    const pendingItem = {
      inventoryId: requirement.inventoryId,
      requestedQuantity: requirement.quantity,
      dispatchedQuantity: 0,
      unit: requirement.unit,
      referenceToOriginalRequirementId: requirement._id,
      reason: requirement.reason || "OUT_OF_STOCK",
      createdBy: user._id,
    };

    // 4. Existing PendingFulfillment
    if (existingKitchen) {
      const alreadyExists = existingKitchen.items.some(
        (item) =>
          item.inventoryId?.toString() === requirement.inventoryId.toString() &&
          item.fulfillmentStatus === "PENDING",
      );

      if (alreadyExists) {
        await requirementRepository.update(
          requirement._id,
          {
            $set: {
              "items.$[item].fulfillmentStatus": false,
            },
          },
          {
            arrayFilters: [
              {
                "item.inventoryId": requirement.inventoryId,
              },
            ],
          },
        );
        throw new ApiError(409, "This item is already in pending fulfillment.");
      }

      const addedItem = await pendingFulfillmentRepository.addItem(
        existingKitchen._id,
        pendingItem,
      );

      // Mark this requirement item as pending
      await requirementRepository.update(
        requirement._id,
        {
          $set: {
            "items.$[item].fulfillmentStatus": false,
          },
        },
        {
          arrayFilters: [
            {
              "item.inventoryId": requirement.inventoryId,
            },
          ],
        },
      );

      return addedItem;
    }
    // 5. No PendingFulfillment exists
    const createdPending = await pendingFulfillmentRepository.create({
      kitchenId: requirement.kitchenId,

      items: [pendingItem],
    });

    // Mark this requirement item as pending
    await requirementRepository.update(
      requirement._id,
      {
        $set: {
          "items.$[item].fulfillmentStatus": false,
        },
      },
      {
        arrayFilters: [
          {
            "item.inventoryId": requirement.inventoryId,
          },
        ],
      },
    );

    return createdPending;
  }

  // ======================================================
  // fetchUnDispatchedRequirementByKitchenId FULFILLMENT
  // ======================================================

  async fetchUnDispatchedRequirementByKitchenId(kitchenId) {
    return await pendingFulfillmentRepository.findUnDispatchedByKitchen(
      kitchenId,
    );
  }
  // ======================================================
  // mergeId FULFILLMENT
  // ======================================================

async mergePendingItem(id, payload, user) {
  try {
    const merged =
      await requirementRepository.mergeItems(
        id,
        payload,
      );

    console.log(
      "merged",
      merged,
      "pendingFulfillmentId",
      payload,
    );

    const pendingFulfillmentId =
      payload[0].pendingFulfillmentId;

    const updates = payload.map((item) => ({
      pendingItemId: item.pendingItemId,

      referenceToDispatchedRequirementId:
        merged._id,

      fulfilledAt:
        merged.updatedAt,

      fulfilledBy:
        user._id,
    }));

    const markedFULFILLED =
      await pendingFulfillmentRepository.markItemsFulfilled(
        pendingFulfillmentId,
        updates,
      );

    return markedFULFILLED;

  } catch (error) {
    console.log(error);
    throw error;
  }
}


  // ======================================================
  // GET ACTIVE PENDING
  // ======================================================

  async getPending(filter = {}) {
    return await pendingFulfillmentRepository.findActive(filter);
  }

  // ======================================================
  // GET ONE
  // ======================================================

  async getById(id) {
    const pending = await pendingFulfillmentRepository.findById(id);

    if (!pending) {
      throw new ApiError(404, "Pending fulfillment not found.");
    }

    return pending;
  }

  // ======================================================
  // CANCEL
  // ======================================================

  async cancel(id, userId) {
    const pending = await pendingFulfillmentRepository.findById(id);

    if (!pending) {
      throw new ApiError(404, "Pending fulfillment not found.");
    }

    if (pending.status === "FULFILLED") {
      throw new ApiError(400, "Fulfilled pending items cannot be cancelled.");
    }

    return await pendingFulfillmentRepository.updateById(id, {
      status: "CANCELLED",
      resolvedAt: new Date(),
      resolvedBy: userId,
    });
  }

  async fulfillPendingItems(items, userId, dispatchData) {
    // ==========================================================
    // VALIDATION
    // ==========================================================

    if (!Array.isArray(items) || !items.length) {
      throw new ApiError(400, "No pending items selected.");
    }

    if (!userId) {
      throw new ApiError(401, "User is required.");
    }

    /*
     * Dispatch details are required.
     *
     * Adjust these according to your UI/model.
     */
    if (!dispatchData?.vehicle) {
      throw new ApiError(400, "Vehicle is required.");
    }

    if (!dispatchData?.driver) {
      throw new ApiError(400, "Driver is required.");
    }

    // ==========================================================
    // GROUP ITEMS BY PENDING FULFILLMENT
    // ==========================================================

    const pendingGroups = new Map();

    for (const item of items) {
      if (!item.pendingFulfillmentId) {
        throw new ApiError(400, "Pending fulfillment ID is required.");
      }

      if (!item.pendingItemId) {
        throw new ApiError(400, "Pending item ID is required.");
      }

      if (!item.inventoryId) {
        throw new ApiError(400, "Inventory ID is required.");
      }

      const quantity = Number(item.quantity);

      if (!Number.isFinite(quantity) || quantity <= 0) {
        throw new ApiError(400, "Quantity must be greater than zero.");
      }

      if (!pendingGroups.has(item.pendingFulfillmentId)) {
        pendingGroups.set(item.pendingFulfillmentId, []);
      }

      pendingGroups.get(item.pendingFulfillmentId).push(item);
    }

    // ==========================================================
    // LOAD AND VALIDATE ALL PENDING ITEMS
    // ==========================================================

    const validatedItems = [];

    for (const [pendingFulfillmentId, requestedItems] of pendingGroups) {
      const pending =
        await pendingFulfillmentRepository.findById(pendingFulfillmentId);

      if (!pending) {
        throw new ApiError(404, "Pending fulfillment not found.");
      }

      for (const requestedItem of requestedItems) {
        const pendingItem = pending.items.find(
          (item) =>
            item._id.toString() === requestedItem.pendingItemId.toString(),
        );

        if (!pendingItem) {
          throw new ApiError(404, "Pending fulfillment item not found.");
        }

        // ------------------------------------------------------
        // Already fulfilled?
        // ------------------------------------------------------

        if (pendingItem.fulfillmentStatus === "FULFILLED") {
          throw new ApiError(
            400,
            `Pending item ${pendingItem.inventoryId?.name || ""} is already fulfilled.`,
          );
        }

        // ------------------------------------------------------
        // Validate inventory
        // ------------------------------------------------------

        if (
          pendingItem.inventoryId?._id?.toString() !==
          requestedItem.inventoryId.toString()
        ) {
          throw new ApiError(
            400,
            "Inventory item does not match pending item.",
          );
        }

        // ------------------------------------------------------
        // Quantity validation
        // ------------------------------------------------------

        const quantity = Number(requestedItem.quantity);

        if (quantity > Number(pendingItem.requestedQuantity)) {
          throw new ApiError(
            400,
            `Cannot fulfill more than requested quantity for ${pendingItem.inventoryId?.name || "item"}.`,
          );
        }

        // ------------------------------------------------------
        // Original requirement
        // ------------------------------------------------------

        const originalRequirement =
          pendingItem.referenceToOriginalRequirementId;

        if (!originalRequirement?._id) {
          throw new ApiError(400, "Original requirement reference is missing.");
        }

        validatedItems.push({
          pendingFulfillmentId,
          pendingItemId: requestedItem.pendingItemId,

          inventoryId: requestedItem.inventoryId,

          quantity,

          unit: requestedItem.unit || pendingItem.unit,

          kitchenId: pending.kitchenId?._id || pending.kitchenId,

          originalRequirementId: originalRequirement._id,
        });
      }
    }

    // ==========================================================
    // CHECK INVENTORY STOCK
    // ==========================================================

    for (const item of validatedItems) {
      const inventory = await inventoryRepository.findById(item.inventoryId);

      if (!inventory) {
        throw new ApiError(404, "Inventory not found.");
      }

      if (Number(inventory.quantity) < Number(item.quantity)) {
        throw new ApiError(400, `${inventory.name} has insufficient stock.`);
      }
    }

    // ==========================================================
    // DEDUCT INVENTORY
    // ==========================================================

    for (const item of validatedItems) {
      const inventory = await inventoryRepository.findById(item.inventoryId);

      inventory.quantity -= Number(item.quantity);

      await inventory.save();
    }

    // ==========================================================
    // GROUP BY ORIGINAL REQUIREMENT
    // ==========================================================

    const requirementGroups = new Map();

    for (const item of validatedItems) {
      const key = item.originalRequirementId.toString();

      if (!requirementGroups.has(key)) {
        requirementGroups.set(key, []);
      }

      requirementGroups.get(key).push(item);
    }

    // ==========================================================
    // CREATE DISPATCHED REQUIREMENTS
    // ==========================================================

    const dispatchedResults = [];

    for (const [originalRequirementId, requirementItems] of requirementGroups) {
      // --------------------------------------------------------
      // Get original requirement
      // --------------------------------------------------------

      const originalRequirement = await requirementRepository.findById(
        originalRequirementId,
      );

      if (!originalRequirement) {
        throw new ApiError(404, "Original requirement not found.");
      }

      // --------------------------------------------------------
      // Make sure all items belong to same kitchen
      // --------------------------------------------------------

      const kitchenId =
        originalRequirement.kitchen?._id || originalRequirement.kitchen;

      if (!kitchenId) {
        throw new ApiError(
          400,
          "Kitchen is missing from original requirement.",
        );
      }

      // --------------------------------------------------------
      // Build dispatched items
      // --------------------------------------------------------

      const dispatchedItems = requirementItems.map((item) => ({
        inventoryId: item.inventoryId,

        quantity: item.quantity,

        unit: item.unit,

        fulfillmentStatus: true,
      }));

      // --------------------------------------------------------
      // Create dispatched requirement
      // --------------------------------------------------------

      const dispatchedRequirement =
        await requirementRepository.createDispatchedRequirement({
          kitchen: kitchenId,

          createdBy: userId,

          status: "Out For Delivery",

          items: dispatchedItems,

          dispatch: {
            vehicle: dispatchData.vehicle,

            driver: dispatchData.driver,

            dispatchedBy: userId,

            dispatchedAt: new Date(),
          },

          receivedAt: null,

          remarks: originalRequirement.remarks || "",
        });

      // --------------------------------------------------------
      // Update ORIGINAL requirement items
      // --------------------------------------------------------

      for (const item of requirementItems) {
        await requirementRepository.markItemFulfilled(
          originalRequirementId,
          item.inventoryId,
        );
      }

      // --------------------------------------------------------
      // Update PENDING items
      // --------------------------------------------------------

      for (const item of requirementItems) {
        await pendingFulfillmentRepository.markItemsFulfilled(
          item.pendingFulfillmentId,
          [
            {
              pendingItemId: item.pendingItemId,

              fulfilledAt: new Date(),

              fulfilledBy: userId,

              referenceToDispatchedRequirementId: dispatchedRequirement._id,
            },
          ],
        );
      }

      dispatchedResults.push({
        originalRequirementId,

        dispatchedRequirementId: dispatchedRequirement._id,

        requirementNumber: dispatchedRequirement.requirementNumber,

        kitchen: kitchenId,

        items: requirementItems.map((item) => ({
          pendingItemId: item.pendingItemId,

          inventoryId: item.inventoryId,

          quantity: item.quantity,

          unit: item.unit,
        })),
      });
    }

    // ==========================================================
    // RETURN RESULT
    // ==========================================================

    return {
      success: true,

      message: "Pending items fulfilled successfully.",

      dispatchedRequirements: dispatchedResults,
    };
  }

  // ======================================================
  // CLEANUP
  // ======================================================

  async cleanupOldPendingItems() {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    await PendingFulfillment.updateMany(
      {},
      {
        $pull: {
          items: {
            fulfillmentStatus: {
              $in: ["FULFILLED", "CANCELLED"],
            },
            updatedAt: {
              $lt: cutoff,
            },
          },
        },
      },
    );
  }
}

export default new PendingFulfillmentService();
