import ApiError from "../utils/ApiError.js";
import { hashPassword } from "../utils/bcrypt.js";

import userRepository from "../repositories/user.repository.js";

import { MESSAGE } from "../constants/responseMessages.js";


class UserService {
  async createUser(payload) {
    const existingUser = await userRepository.findByPhone(payload.phone);

    if (existingUser) {
      throw new ApiError(400, "Phone number already exists");
    }

    payload.password = await hashPassword(payload.password);

    return await userRepository.create(payload);
  }

  async getUsers() {
    return await userRepository.findAll({
      isActive: true,
    });
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new ApiError(404, MESSAGE.NOT_FOUND);
    }

    return user;
  }

  async updateUser(id, payload) {
    if (payload.password) {
      payload.password = await hashPassword(payload.password);
    }

    const user = await userRepository.update(id, payload);

    if (!user) {
      throw new ApiError(404, MESSAGE.NOT_FOUND);
    }

    return user;
  }

  async deactivateUser(id) {
    const user = await userRepository.update(id, {
      isActive: false,
    });

    if (!user) {
      throw new ApiError(404, MESSAGE.NOT_FOUND);
    }

    return user;
  }

  async activateUser(id) {
    const user = await userRepository.update(id, {
      isActive: true,
    });

    if (!user) {
      throw new ApiError(404, MESSAGE.NOT_FOUND);
    }

    return user;
  }
}

export default new UserService();
