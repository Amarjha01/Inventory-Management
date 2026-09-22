import mongoose from "mongoose";

const { Schema } = mongoose;

/*
|--------------------------------------------------------------------------
| Service Schema
|--------------------------------------------------------------------------
*/

const serviceSchema = new Schema(
  {
    partName: {
      type: String,
      required: true,
      trim: true,
    },

    serviceDate: {
      type: Date,
      required: true,
    },

    partyName: {
      type: String,
      required: true,
      trim: true,
    },

    nextServiceDate: {
      type: Date,
      default: null,
    },

    narration: {
      type: String,
      trim: true,
      default: "",
    },

    // Maximum 2 images
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (value) {
          return value.length <= 5;
        },
        message: "Maximum 5 images are allowed for a service record.",
      },
    },
  },
  {
    timestamps: true,
  },
);

/*
|--------------------------------------------------------------------------
| Visitor Schema
|--------------------------------------------------------------------------
*/

const visitorSchema = new Schema(
  {
    problemDate: {
      type: Date,
      required: true,
    },

    visitorName: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "COMPLETED"],
      default: "PENDING",
      required: true,
      trim: true,
    },

    feedbackTrail: [{
      sentBy: {
        type: mongoose.Types.ObjectId,
        ref:"User",
        required: true,
      },
      message: {
        type: String,
        default: "",
      },
      createdAt: Date,
    }],

    // Any part changed / work done
    narration: {
      type: String,
      trim: true,
      default: "",
    },

    otherImages: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

/*
|--------------------------------------------------------------------------
| Purchase Record Schema
|--------------------------------------------------------------------------
*/

const purchaseRecordSchema = new Schema(
  {
    purchaseDate: {
      type: Date,
      required: true,
    },

    ReceivedDate: {
      type: Date,
      required: true,
    },

    partName: {
      type: String,
      required: true,
      trim: true,
    },

    partyName: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional guarantee/warranty document/photo
    guaranteePhoto: {
      type: String,
      default: null,
    },

    expiryWarrantyYear: {
      type: String,
      trim: true,
      default: "",
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    // Other supporting images
    otherImages: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

/*
|--------------------------------------------------------------------------
| Main Maintenance Schema
|--------------------------------------------------------------------------
*/

const maintenanceSchema = new Schema(
  {
    /*
     * Keep this according to your existing application's
     * User/Asset reference.
     *
     * If this is userId:
     */
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    kitchenId: {
      type: Schema.Types.ObjectId,
      ref: "Kitchen",
      required: true,
      index: true,
    },
    /*
     * Service records
     */
    service: {
      type: serviceSchema,
      default: null,
    },

    /*
     * Visitor/problem records
     */
    visitor: {
      type: visitorSchema,
      default: null,
    },

    /*
     * Purchase records
     */
    purchaseRecord: {
      type: purchaseRecordSchema,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

maintenanceSchema.index({ userId: 1 });

/*
|--------------------------------------------------------------------------
| Model
|--------------------------------------------------------------------------
*/

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);

export default Maintenance;
