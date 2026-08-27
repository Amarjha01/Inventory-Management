import mongoose from "mongoose";

import env from "./env.js";

import logger from "../utils/logger.js";
import Requirement from "../models/requirement.js";
import Inventory from "../models/inventory.js";
import Vehicle from "../models/vehicle.js";

const connectDatabase = async () => {
  try {
    mongoose.set("strictQuery", true);

    const connection = await mongoose.connect(env.MONGODB_URI);

    logger.info(
      `MongoDB Connected : ${connection.connection.host}`
    );

    // One-time migration
    // const result = await Vehicle.updateMany(
    //   {
    //     tracker: { $exists: false },
    //   },
    //   {
    //     $set: {
    //       tracker: {
    //         provider:"",
    //         envKey:"",
    //         isActive:false
    //       },
    //     },
    //   }
    // );

    // console.log(`Matched: ${result.matchedCount}`);
    // console.log(`Modified: ${result.modifiedCount}`);

  } catch (error) {
    console.log("error", error);

    process.exit(1);
  }
};

export default connectDatabase;
