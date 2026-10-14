import ApiError from "../utils/ApiError.js";
import { verifyToken } from "../utils/jwt.js";
import userRepository from "../repositories/user.repository.js";

const gpsTrackingAuth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization || "";
    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new ApiError(401, "GPS tracking token required");
    }

    const payload = verifyToken(token);

    if (
      payload.typ !== "gps_tracking" ||
      payload.tripId !== req.params.tripId ||
      !payload.id
    ) {
      throw new ApiError(401, "Invalid GPS tracking token");
    }

    const user = await userRepository.findById(payload.id);

    if (!user || !user.isActive) {
      throw new ApiError(401, "Invalid or inactive user");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default gpsTrackingAuth;