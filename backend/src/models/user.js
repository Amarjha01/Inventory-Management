import mongoose from "mongoose";

import { ROLE } from "../constants/roles.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: Object.values(ROLE),
      required: true,
    },

    kitchenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kitchen",
      default: null,
    },
    district:[
      {type: String}
    ],

    language: {
      type: String,
      enum: ["en", "hi"],
      default: "en",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    notificationEnabled: {
      type: Boolean,
      default: false,
    },
    isFirstLogin: {
      type: Boolean,
      default: true,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);



const User = mongoose.model("User", userSchema);

export default User;