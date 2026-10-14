import jwt from "jsonwebtoken";

import env from "../config/env.js";

export const generateToken = (payload) => {
  return jwt.sign(
    payload,

    env.JWT_SECRET,

    {
      expiresIn: env.JWT_EXPIRES_IN,
    },
  );
};

export const verifyToken = (token) => {
  return jwt.verify(
    token,

    env.JWT_SECRET,
  );
};

export const generateGpsTrackingToken = (userId, tripId) => {
  return jwt.sign(
    {
      id: String(userId),
      tripId: String(tripId),
      typ: "gps_tracking",
    },
    env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
};