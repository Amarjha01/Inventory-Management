import ApiError from "../utils/ApiError.js";

import { comparePassword } from "../utils/bcrypt.js";

import { generateToken } from "../utils/jwt.js";

import userRepository from "../repositories/user.repository.js";

class AuthService {
  async login({
    phone,

    password,
  }) {
    const user = await userRepository.findByPhone(phone);
    
    if (!user) {
      throw new ApiError(
        401,

        "Invalid phone or password",
      );
    }

    const passwordMatched = await comparePassword(
      password,

      user.password,
    );

    if (!passwordMatched) {
      throw new ApiError(
        401,

        "Invalid phone or password",
      );
    }

    if (!user.isActive) {
      throw new ApiError(
        403,

        "Your account has been disabled.",
      );
    }

    await userRepository.update(
      user._id,
      {
        lastLoginAt:Date.now()
      }
    );

    const token = generateToken({
      id: user._id,

      role: user.role,
    });

    user.password = undefined;
    console.log("user", user);
    
    return {

    accessToken: token,

    user

};
  }
}

export default new AuthService();