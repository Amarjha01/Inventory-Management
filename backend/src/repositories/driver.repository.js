import Driver from "../models/driver.js";

class DriverRepository {
  async create(payload) {
    return await Driver.create(payload);
  }

  async findMany(filter = {}) {
    return await Driver.find(filter)
      .sort({
        name: 1,
      })
      .lean();
  }

  async findById(id) {
    return await Driver.findById(id).lean();
  }

  async update(id, payload) {
    return await Driver.findByIdAndUpdate(
      id,

      payload,

      {
        new: true,

        runValidators: true,
      },
    ).lean();
  }

  async activate(id) {
    return await Driver.findByIdAndUpdate(
      id,

      {
        isActive: true,
      },

      {
        new: true,
      },
    ).lean();
  }

  async deactivate(id) {
    return await Driver.findByIdAndUpdate(
      id,

      {
        isActive: false,
      },

      {
        new: true,
      },
    ).lean();
  }
}

export default new DriverRepository();
