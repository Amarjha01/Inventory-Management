import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
  {
    sequence: Number,
    name: String,
    address: String,
    latitude: Number,
    longitude: Number,

    status: {
      type: String,
      enum: ["PENDING", "CURRENT", "ARRIVED", "COMPLETED", "SKIPPED"],
      default: "PENDING",
    },

arrival: {
  location: {
    latitude: Number,
    longitude: Number,
    accuracy: Number,
    capturedAt: Date,
  },

  distanceFromDestinationMeters: Number,
},

    distance: Number,

    selfie: {
      imageUrl: String,
      capturedAt: Date,
    },

    meter: {
      reading: Number,
      imageUrl: String,
      capturedAt: Date,
    },

    fuelEntries: [
      {
        litres: Number,
        totalAmount: Number,
        slipImageUrl: String,
        latitude: Number,
        longitude: Number,
        capturedAt: Date,
      },
    ],

    completedAt: Date,
  },
  {
    _id: true,
    timestamps: true,
  }
);

// GPS trail point
const gpsTrailSchema = new mongoose.Schema(
  {
    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    accuracy: {
      type: Number,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const tripSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    status: {
      type: String,
      enum: ["DRAFT", "READY", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "DRAFT",
    },
    auditLog: {
  type: [
    {
      action: {
        type: String,
        required: true,
      },

      actor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      role: String,

      metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },

      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  default: [],
},

    startLocation: {
      address: String,
      name: String,

      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },

      source: {
        type: String,
        enum: ["GPS", "MANUAL"],
        required: true,
      },

      accuracy: Number,
      capturedAt: Date,
    },

    startMeter: {
      reading: Number,
      imageUrl: String,
      capturedAt: Date,
    },

    destinations: [destinationSchema],

    // GPS tracking history
    gpsTrail: [gpsTrailSchema],

    finalMeter: {
      reading: Number,
      imageUrl: String,
      capturedAt: Date,
    },

    totalDistance: Number,

    startedAt: Date,

    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Trip", tripSchema);