import mongoose from "mongoose";

import env from "./env.js";

import logger from "../utils/logger.js";

const connectDatabase = async () => {
  try {
    mongoose.set("strictQuery", true);

    const connection = await mongoose.connect(env.MONGODB_URI);

    logger.info(
      `MongoDB Connected : ${connection.connection.host}`
    );
  } catch (error) {
//     logger.error({
//     message: error.message,
//     stack: error.stack
// });

    process.exit(1);
  }
};

export default connectDatabase;