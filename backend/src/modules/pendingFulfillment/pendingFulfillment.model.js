import mongoose from "mongoose";

const pendingFulfillmentItemSchema = new mongoose.Schema(
  {
    inventoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },

    requestedQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

    dispatchedQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

    pendingQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const pendingFulfillmentSchema = new mongoose.Schema(
  {
    sourceRequirement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Requirement",
      required: true,
      index: true,
    },

    kitchen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kitchen",
      required: true,
      index: true,
    },

    requirementNumber: {
      type: String,
      required: true,
      trim: true,
    },

    items: {
      type: [pendingFulfillmentItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "At least one pending item is required",
      },
    },

    reason: {
      type: String,
      enum: [
        "OUT_OF_STOCK",
        "PARTIAL_STOCK",
        "OTHER",
      ],
      default: "OUT_OF_STOCK",
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "PARTIALLY_FULFILLED",
        "FULFILLED",
        "CANCELLED",
      ],
      default: "PENDING",
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },

    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

pendingFulfillmentSchema.index({
  kitchen: 1,
  status: 1,
});

pendingFulfillmentSchema.index({
  sourceRequirement: 1,
});

export default mongoose.model(
  "PendingFulfillment",
  pendingFulfillmentSchema,
);