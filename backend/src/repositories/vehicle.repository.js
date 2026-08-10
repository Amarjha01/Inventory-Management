import Vehicle from "../models/vehicle.js";

class VehicleRepository {
  async create(payload) {
    console.log(payload);
    
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
  async findByVehicleNumber(VehicleNumber) {
    console.log("vehicleNumber repo 23" , VehicleNumber);
    
    return await Vehicle.findOne({vehicleNumber:VehicleNumber})
  }

  async update(id, payload) {
    console.log("payload at vehicle repo" , payload , id);
    
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
