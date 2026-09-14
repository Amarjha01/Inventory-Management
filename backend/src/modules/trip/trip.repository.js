import Trip from "./trip.model.js";

class TripRepository {
  async create(payload) {
    console.log("payload at repo" , payload );
    
    return Trip.create(payload);
  }

  async findById(tripId, options = {}) {
    let query = Trip.findById(tripId);

    if (options.populate !== false) {
      query = query
        .populate("driver")
        .populate("vehicle");
    }

    return query;
  }

  async findByIdLean(tripId) {
    return Trip.findById(tripId).lean();
  }

  async findByDriver(driverId, options = {}) {
    const {
      page = 1,
      limit = 20,
      status,
    } = options;

    const filter = { driver: driverId };

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Trip.find(filter)
        .populate("vehicle")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Trip.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findAll(options = {}) {
    const {
      page = 1,
      limit = 20,
      status,
      driverId,
      vehicleId,
    } = options;

    const filter = {};

    if (status) filter.status = status;
    if (driverId) filter.driver = driverId;
    if (vehicleId) filter.vehicle = vehicleId;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Trip.find(filter)
        .populate("driver")
        .populate("vehicle")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Trip.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findActiveByDriver(driverId) {
    return Trip.findOne({
      driver: driverId,
      status: { $in: ["READY", "IN_PROGRESS"] },
    })
      .populate("vehicle")
      .lean();
  }

  async findActiveByVehicle(vehicleId) {
    return Trip.findOne({
      vehicle: vehicleId,
      status: { $in: ["READY", "IN_PROGRESS"] },
    }).lean();
  }

  async updateById(tripId, update) {
    return Trip.findByIdAndUpdate(
      tripId,
      update,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("driver")
      .populate("vehicle");
  }

  async save(document) {
    return document.save();
  }

  async deleteById(tripId) {
    return Trip.findByIdAndDelete(tripId);
  }
}

export default new TripRepository();
