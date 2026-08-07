import Kitchen from "../models/kitchen.js";

class KitchenRepository {
  async create(payload) {
    return await Kitchen.create(payload);
  }

  async findById(id) {
    return await Kitchen.findById(id).lean();
  }

  async findMany(filter = {}) {
    return await Kitchen.find(filter)
      .sort({
        district: 1,
        name: 1,
      })
      .lean();
  }

  async update(id, payload) {
    return await Kitchen.findByIdAndUpdate(
      id,

      payload,

      {
        new: true,
        runValidators: true,
      },
    ).lean();
  }

  async deactivate(id) {
    return await Kitchen.findByIdAndUpdate(
      id,

      {
        isActive: false,
      },
      {
        new: true,
      },
    ).lean();
  }

  async activate(id) {
    return await Kitchen.findByIdAndUpdate(
      id,

      {
        isActive: true,
      },
      {
        new: true,
      },
    ).lean();
  }
}

export default new KitchenRepository();
