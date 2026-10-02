import mongoose from "mongoose";

const gpsTrailSchema = mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    gpsTrail: [
      {
        latitude: Number,
        longitude: Number,
        accuracy: Number,
        capturedAt: Date,
      },
    ],
    status: {
      type: {
        enum: ["ACTIVE", "COMPLETED"],
      },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("gpsTrail" , gpsTrailSchema)