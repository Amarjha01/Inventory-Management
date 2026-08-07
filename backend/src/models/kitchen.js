import mongoose from "mongoose";

const kitchenSchema = new mongoose.Schema(
  {
    district: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    contactPerson: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 15,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

kitchenSchema.index({
  district: 1,
  name: 1,
});

const Kitchen = mongoose.model("Kitchen", kitchenSchema);

export default Kitchen;