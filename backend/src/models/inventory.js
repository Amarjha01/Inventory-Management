import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    hindiName: {
      type: String,
      required: true,
      trim: true,
    },
    requirementType: {
      type: String,
      enum: ["RM", "BARTAN", "STATIONERY" , "MAINTENANCE"],
      default: "RM",
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    bagSize: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    unit: {
      type: String,
      required: true,
      trim: true,
    },

    minimumStock: {
      type: Number,
      default: 0,
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

inventorySchema.index({
  name: 1,
});

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;
