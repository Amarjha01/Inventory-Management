import mongoose from "mongoose";
import { REQUIREMENT_STATUS } from "../../constants/status.js";


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

    unit: {
      type: String,
      required: true,
      trim: true,
    },

    fulfillmentStatus: {
      type: String,
      enum: ["PENDING", "FULFILLED", "CANCELLED"],
      default: "PENDING",
      index: true,
    },

    referenceToOriginalRequirementId:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"Requirement",
     default:null
    },
    
    referenceToDispatchedRequirementId:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"Requirement",
     default:null
    },

     reason: {
      type: String,
      enum: ["OUT_OF_STOCK", "NOT_PERMITED"],
      default: "OUT_OF_STOCK",
    },

    remarks: {
      type: String,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fulfilledAt: {
      type: Date,
      default: null,
    },

    fulfilledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
   {
    _id: true,
    timestamps: true,
  },
);

const pendingFulfillmentSchema = new mongoose.Schema(
  {

    kitchenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kitchen",
      required: true,
      index: true,
    },

    items: {
      type: [pendingFulfillmentItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "At least one pending item is required",
      },
    }, 
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("PendingFulfillment", pendingFulfillmentSchema);
