import gpsTrailModel from "./gpsTrail.model.js";
import Trip from "./trip.model.js";

class TripRepository {
  async create(payload) {
    console.log("payload at repo", payload);

    return Trip.create(payload);
  }

  async findById(tripId, options = {}) {
    let query = Trip.findById(tripId);

    if (options.populate !== false) {
      query = query.populate("driver").populate("vehicle");
    }

    return query;
  }

  async findByIdLean(tripId) {
    return Trip.findById(tripId).lean();
  }

  async findByDriver(driverId, options = {}) {
    const { page = 1, limit = 20, status } = options;

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
    const { page = 1, limit = 20, status, driverId, vehicleId } = options;

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
    return Trip.findByIdAndUpdate(tripId, update, {
      new: true,
      runValidators: true,
    })
      .populate("driver")
      .populate("vehicle");
  }

  async save(document) {
    return document.save();
  }

  async deleteById(tripId) {
    return Trip.findByIdAndDelete(tripId);
  }

async CreateGpsTrail(user , tripId, gpsTrail) {
  const trip = await Trip.findById(tripId);

  if (!trip) {
    throw new Error("Trip not found");
  }

  if (trip.status !== "IN_PROGRESS") {
    throw new Error("GPS tracking is allowed only for active trips");
  }
  
  if (!trip.driver.equals(user._id)) {
  throw new Error("You are not assigned to this trip");
}
  // Extract the nested GPS payload.
  const coordinates = gpsTrail?.gpsCoordinates;

  const latitude = Number(coordinates?.latitude);
  const longitude = Number(coordinates?.longitude);

  const accuracy =
    coordinates?.accuracy == null
      ? undefined
      : Number(coordinates.accuracy);

  if (
    coordinates?.latitude == null ||
    coordinates?.longitude == null ||
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error("Invalid GPS coordinates");
  }

  if (
    accuracy !== undefined &&
    (!Number.isFinite(accuracy) || accuracy < 0)
  ) {
    throw new Error("Invalid GPS accuracy");
  }

  trip.gpsTrail.push({
    latitude,
    longitude,
    ...(accuracy !== undefined && { accuracy }),
    createdAt: coordinates.capturedAt
      ? new Date(coordinates.capturedAt)
      : new Date(),
  });

  await trip.save();

  return trip;
}

async getAdminTripSummary(){
  const [total, statusCounts] = await Promise.all([
    Trip.countDocuments(),
    Trip.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  return {
    total,
    byStatus: statusCounts.reduce((result, item)=>{
      result[item._id] = item.count;
      return result;
    }, {}),
  };
};

async getAdminTripById(tripId){
  return Trip.findById(tripId)
    .select("-gpsTrail")
    .populate("driver", "name phone")
    .populate("vehicle", "vehicleNumber vehicleName capacity")
    .lean();
};

async getAdminTripGpsTrail(tripId){
  return Trip.findById(tripId)
    .select("gpsTrail")
    .lean();
};


}

export default new TripRepository();
