import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    licenseNumber: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
    },

    address: {
      type: String,
      default: "",
    },

    remarks: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Driver = mongoose.model("Driver", driverSchema);

export default Driver;
