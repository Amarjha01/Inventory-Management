import Inventory from "../models/inventory.js";

class InventoryRepository {
  async create(payload) {
    return await Inventory.create(payload);
  }

  async findMany(filter = {}) {
    return await Inventory.find(filter)
      .sort({
        name: 1,
      })
      .lean();
  }

  async findById(id) {
    return await Inventory.findById(id).lean();
  }

  async update(id, payload) {
    return await Inventory.findByIdAndUpdate(
      id,

      payload,

      {
        new: true,
        runValidators: true,
      },
    ).lean();
  }

  async updateStock(id, quantity) {
    return await Inventory.findByIdAndUpdate(
      id,

      {
        quantity,
      },

      {
        new: true,
      },
    ).lean();
  }

  async deactivate(id) {
    return await Inventory.findByIdAndUpdate(
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
    return await Inventory.findByIdAndUpdate(
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

export default new InventoryRepository();
