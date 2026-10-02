import mongoose, { Schema } from "mongoose";

const DGSchema = new Schema(
  {
    kitchenId: {
      type: Schema.Types.ObjectId,
      ref: "Kitchen",
      required: true,
    },

    DGNumber: {
      type: Number,
      required: true,
    },

    DGModel: {
      type: String,
      required: true,
    },

    voltage: {
      type: Number,
    },

    SRNO: {
      type: String,
      required: true,
    },

    KVA: {
      type: Number,
    },

    phase: {
      type: String,
    },

    current: {
      type: Number,
    },
    
    fuelConsumptionHr:{
      type:Number,
    }
  },
  { timestamps: true }
);

const DGMonitoringSchema = new Schema(
  {
    DGID: {
      type: Schema.Types.ObjectId,
      ref: "DG",
      required: true,
    },

    start: {
      type: Date,
      required: true,
    },

    stop: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["RUNNING", "STOPPED"],
      required: true,
    },

    runtimeSeconds: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

export const DG = mongoose.model("DG", DGSchema);
export const DGMonitoring = mongoose.model(
  "DGMonitoring",
  DGMonitoringSchema
);