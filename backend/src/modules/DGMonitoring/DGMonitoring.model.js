import mongoose, { Schema } from "mongoose";

const DGSchema = new Schema(
  {
    kitchenId: {
      type: Schema.Types.ObjectId,
      ref: "Kitchen",
      required: true,
    },

    DGID: {
      type: Number,
      required: true,
    },

    DGModel: {
      type: String,
    },

    voltage: {
      type: Number,
    },

    SRNO: {
      type: String,
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

    fuelConsumptionHr: {
      type: Number,
    },

    // ESP32 health monitoring
    deviceId: {
      type: String,
      trim: true,
    },

    deviceStatus: {
      type: String,
      enum: ["ONLINE", "OFFLINE", "UNKNOWN"],
      default: "UNKNOWN",
    },

    wifiConnected: {
      type: Boolean,
    },

    uptimeSeconds: {
      type: Number,
      min: 0,
    },

    freeHeapBytes: {
      type: Number,
      min: 0,
    },

    dgState: {
      type: String,
      enum: ["RUNNING", "STOPPED", "UNKNOWN"],
      default: "UNKNOWN",
    },

    lastApiSuccess: {
      type: Boolean,
    },

    lastHealthReportAt: {
      type: Date,
    },
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
export const DGMonitoring = mongoose.model("DGMonitoring", DGMonitoringSchema);