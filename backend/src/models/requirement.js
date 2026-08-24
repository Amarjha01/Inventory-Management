import mongoose from "mongoose";

import { REQUIREMENT_STATUS } from "../constants/status.js";

const requirementItemSchema = new mongoose.Schema(
{
    inventoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inventory",
        required: true,
    },

    quantity: {
        type: Number,
        required: true,
        min: 1,
    },

    dispatchedQuantity: {
        type: Number,
        default: null,
        min: 0,
    },

    unit: {
        type: String,
        required: true,
    },
},
{
    _id: false,
}
);

const requirementSchema = new mongoose.Schema(
  {
    requirementNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    kitchen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kitchen",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    remarks: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: Object.values(REQUIREMENT_STATUS),
      default: REQUIREMENT_STATUS.SUBMITTED,
    },

    items: {
      type: [requirementItemSchema],

      validate: {
        validator: (items) => items.length > 0,

        message: "Requirement must contain at least one item.",
      },
    },

    dispatch: {
      vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
        default: null,
      },

      driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        default: null,
      },

      dispatchedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },

      dispatchedAt: {
        type: Date,
        default: null,
      },
    },

    receivedAt: {
      type: Date,

      default: null,
    },
gatePass: [
  {
    image: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
],
  },
  {
    timestamps: true,

    versionKey: false,
  },
);

requirementSchema.index({
  kitchen: 1,

  status: 1,

  createdAt: -1,
});

const Requirement = mongoose.model(
  "Requirement",

  requirementSchema,
);

export default Requirement;
