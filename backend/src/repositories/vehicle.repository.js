import Vehicle from "../models/vehicle.js";

class VehicleRepository {
  async create(payload) {
    return await Vehicle.create(payload);
  }

  async findMany(filter = {}) {
    return await Vehicle.find(filter)
      .populate("driver")
      .sort({
        vehicleNumber: 1,
      })
      .lean();
  }

  async findById(id) {
    return await Vehicle.findById(id).populate("driver").lean();
  }

  async update(id, payload) {
    return await Vehicle.findByIdAndUpdate(
      id,

      payload,

      {
        new: true,
        runValidators: true,
      },
    )
      .populate("driver")
      .lean();
  }

  async activate(id) {
    return await Vehicle.findByIdAndUpdate(
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
    return await Vehicle.findByIdAndUpdate(
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

export default new VehicleRepository();
