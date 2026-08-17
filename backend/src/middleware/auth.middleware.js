import ApiError from "../utils/ApiError.js";
import { verifyToken } from "../utils/jwt.js";
import userRepository from "../repositories/user.repository.js";

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    console.log("token received" , token);
    
    if (!token) {
      throw new ApiError(401, "Authentication required");
    }

    const payload = verifyToken(token);

    const user = await userRepository.findById(payload.id);

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    if (!user.isActive) {
      throw new ApiError(403, "User account is disabled");
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
