import tripRepository from "./trip.repository.js";
import ApiError from "../../utils/ApiError.js";

const DEFAULT_GEOFENCE_RADIUS_METERS = 100;

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const toNumber = (value, fieldName) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new ApiError(400, `${fieldName} must be a valid number.`);
  }

  return number;
};

const validateCoordinates = (latitude, longitude) => {
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    throw new ApiError(400, "Invalid latitude.");
  }

  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    throw new ApiError(400, "Invalid longitude.");
  }
};

const getUserId = (user) =>
  user?._id?.toString?.() ||
  user?.id?.toString?.() ||
  user?.userId?.toString?.() ||
  null;

const getUserRole = (user) => user?.role?.toString?.() || "";

/* -------------------------------------------------------------------------- */
/* Ownership                                                                  */
/* -------------------------------------------------------------------------- */

const assertTripOwner = (trip, user) => {
  console.log("user" , user);
  
  const userId = getUserId(user);

  console.log(userId);
  console.log("trip.driver?._id?.toString?.()", trip.driver?._id?.toString?.());
  
  if (!userId) {
    throw new ApiError(401, "User could not be identified.");
  }

  if (trip.driver?._id?.toString?.() !== userId) {
    console.log();
    
    throw new ApiError(403, "You are not authorized to access this trip.");
  }
};

/* -------------------------------------------------------------------------- */
/* Location                                                                   */
/* -------------------------------------------------------------------------- */

const normalizeLocation = (location, fallbackSource = "GPS") => {
  if (!location) {
    throw new ApiError(400, "Location is required.");
  }

  const latitude = toNumber(location.latitude, "latitude");

  const longitude = toNumber(location.longitude, "longitude");

  validateCoordinates(latitude, longitude);

  const capturedAt = location.capturedAt
    ? new Date(location.capturedAt)
    : new Date();

  if (Number.isNaN(capturedAt.getTime())) {
    throw new ApiError(400, "Invalid location timestamp.");
  }

  return {
    address: location.address?.trim?.() || "",

    latitude,
    longitude,

    source: location.source || fallbackSource,

    accuracy:
      location.accuracy === undefined
        ? undefined
        : toNumber(location.accuracy, "accuracy"),

    capturedAt,
  };
};

/* -------------------------------------------------------------------------- */
/* Meter                                                                       */
/* -------------------------------------------------------------------------- */

const normalizeMeter = (meter, imageUrl = "") => {
  if (!meter) {
    throw new ApiError(400, "Meter reading is required.");
  }

  const reading = toNumber(meter.reading, "meter reading");

  if (reading < 0) {
    throw new ApiError(400, "Meter reading cannot be negative.");
  }

  const capturedAt = meter.capturedAt ? new Date(meter.capturedAt) : new Date();

  if (Number.isNaN(capturedAt.getTime())) {
    throw new ApiError(400, "Invalid meter timestamp.");
  }

  return {
    reading,

    imageUrl: imageUrl || meter.imageUrl || "",

    capturedAt,
  };
};

/* -------------------------------------------------------------------------- */
/* Destination                                                                */
/* -------------------------------------------------------------------------- */

const findDestination = (trip, destinationId) => {
  const destination = trip.destinations.id(destinationId);

  if (!destination) {
    throw new ApiError(404, "Destination not found.");
  }

  return destination;
};

const assertCurrentDestination = (trip, destination) => {
  const current = trip.destinations.find((item) => item.status === "CURRENT");

  if (!current) {
    throw new ApiError(409, "No current destination is active.");
  }

  if (current._id.toString() !== destination._id.toString()) {
    throw new ApiError(
      409,
      "Complete the current destination before moving to another destination.",
    );
  }
};

const activateFirstDestination = (trip) => {
  const firstPending = trip.destinations.find(
    (destination) => destination.status === "PENDING",
  );

  if (firstPending) {
    firstPending.status = "CURRENT";
  }
};

/* -------------------------------------------------------------------------- */
/* Distance                                                                    */
/* -------------------------------------------------------------------------- */

const haversineDistanceMeters = (
  latitude1,
  longitude1,
  latitude2,
  longitude2,
) => {
  const earthRadiusMeters = 6371000;

  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const dLat = toRadians(latitude2 - latitude1);

  const dLon = toRadians(longitude2 - longitude1);

  const lat1 = toRadians(latitude1);
  const lat2 = toRadians(latitude2);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * earthRadiusMeters * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/* -------------------------------------------------------------------------- */
/* Totals                                                                      */
/* -------------------------------------------------------------------------- */

const recalculateTripTotals = (trip) => {
  let fuelLitres = 0;
  let fuelAmount = 0;

  for (const destination of trip.destinations) {
    for (const fuel of destination.fuelEntries || []) {
      fuelLitres += Number(fuel.litres || 0);

      fuelAmount += Number(fuel.totalAmount || 0);
    }
  }

  trip.totalFuelLitres = Number(fuelLitres.toFixed(3));

  trip.totalFuelAmount = Number(fuelAmount.toFixed(2));

  if (
    trip.finalMeter?.reading !== undefined &&
    trip.startMeter?.reading !== undefined
  ) {
    const distance = trip.finalMeter.reading - trip.startMeter.reading;

    if (distance < 0) {
      throw new ApiError(
        400,
        "Final meter reading cannot be lower than initial meter reading.",
      );
    }

    trip.totalDistanceKm = Number(distance.toFixed(2));
  }
};

/* -------------------------------------------------------------------------- */
/* Service                                                                     */
/* -------------------------------------------------------------------------- */

class TripService {
  /* ------------------------------------------------------------------------ */
  /* Create Trip                                                              */
  /* ------------------------------------------------------------------------ */

  async createTrip(payload, user) {
    
    const driverId = payload.driverId || getUserId(user);

    if (!driverId) {
      throw new ApiError(400, "Driver could not be determined.");
    }

    if (!payload.vehicleId) {
      throw new ApiError(400, "Vehicle is required.");
    }

    if (
      !Array.isArray(payload.destinations) ||
      payload.destinations.length === 0
    ) {
      throw new ApiError(400, "At least one destination is required.");
    }

    // const activeTrip = await tripRepository.findActiveByDriver(driverId);

    // if (activeTrip) {
    //   throw new ApiError(409, "Driver already has an active trip.");
    // }

    const vehicleActiveTrip = await tripRepository.findActiveByVehicle(
      payload.vehicleId,
    );

    if (vehicleActiveTrip) {
      throw new ApiError(409, "Vehicle already has an active trip.");
    }

    const destinations = payload.destinations.map((destination, index) => {
      const latitude = toNumber(
        destination.latitude,
        `destination[${index}].latitude`,
      );

      const longitude = toNumber(
        destination.longitude,
        `destination[${index}].longitude`,
      );

      // validateCoordinates(latitude, longitude);

      const geofenceRadius =
        Number(destination.geofenceRadiusMeters) ||
        DEFAULT_GEOFENCE_RADIUS_METERS;

      if (geofenceRadius <= 0) {
        throw new ApiError(
          400,
          `destination[${index}].geofenceRadiusMeters must be greater than zero.`,
        );
      }

      return {
        sequence: index + 1,
        name: destination.name?.trim?.(),
        address: destination.address?.trim?.() || "",
        startLocation:payload.startLocation,
        latitude,
        longitude,
        geofenceRadiusMeters: geofenceRadius,
        status: "PENDING",
      };
    });

    if (destinations.some((destination) => !destination.name)) {
      throw new ApiError(400, "Every destination needs a name.");
    }

    const trip = await tripRepository.create({
      driver: driverId,

      vehicle: payload.vehicleId,

      status: "READY",

      destinations,

      startMeter:payload.startMeter,
      
      startLocation:payload.startLocation,

      route: payload.route || undefined,

      auditLog: [
        {
          action: "TRIP_CREATED",

          actor: getUserId(user),

          role: getUserRole(user),
        },
      ],
    });

    return tripRepository.findById(trip._id);
  }

  /* ------------------------------------------------------------------------ */
  /* Get My Trips                                                             */
  /* ------------------------------------------------------------------------ */

  async getMyTrips(user, options = {}) {
    const driverId = getUserId(user);

    if (!driverId) {
      throw new ApiError(400, "Driver could not be determined.");
    }

    return tripRepository.findByDriver(driverId, options);
  }

  /* ------------------------------------------------------------------------ */
  /* Get All Trips                                                            */
  /* ------------------------------------------------------------------------ */

  async getAllTrips(user, options = {}) {
    return tripRepository.findAll(options);
  }

  /* ------------------------------------------------------------------------ */
  /* Get Trip By ID                                                           */
  /* ------------------------------------------------------------------------ */

  async getTripById(tripId, user) {
    const trip = await tripRepository.findById(tripId);

    if (!trip) {
      throw new ApiError(404, "Trip not found.");
    }

    assertTripOwner(trip, user);

    return trip;
  }

  /* ------------------------------------------------------------------------ */
  /* Update Trip                                                              */
  /* ------------------------------------------------------------------------ */

  async updateTrip(tripId, payload, user) {
    const trip = await tripRepository.findById(tripId, {
      populate: false,
    });

    if (!trip) {
      throw new ApiError(404, "Trip not found.");
    }

    assertTripOwner(trip, user);

    if (!["DRAFT", "READY"].includes(trip.status)) {
      throw new ApiError(409, "Trip can only be edited before it starts.");
    }

    /* -------------------------- Destinations ----------------------------- */

    if (payload.destinations !== undefined) {
      if (
        !Array.isArray(payload.destinations) ||
        payload.destinations.length === 0
      ) {
        throw new ApiError(400, "At least one destination is required.");
      }

      const destinations = payload.destinations.map((destination, index) => {
        const latitude = toNumber(
          destination.latitude,
          `destination[${index}].latitude`,
        );

        const longitude = toNumber(
          destination.longitude,
          `destination[${index}].longitude`,
        );

        validateCoordinates(latitude, longitude);

        const geofenceRadius =
          Number(destination.geofenceRadiusMeters) ||
          DEFAULT_GEOFENCE_RADIUS_METERS;

        if (geofenceRadius <= 0) {
          throw new ApiError(
            400,
            `destination[${index}].geofenceRadiusMeters must be greater than zero.`,
          );
        }

        return {
          sequence: index + 1,

          name: destination.name?.trim?.(),

          address: destination.address?.trim?.() || "",

          latitude,
          longitude,

          geofenceRadiusMeters: geofenceRadius,

          status: "PENDING",
        };
      });

      if (destinations.some((destination) => !destination.name)) {
        throw new ApiError(400, "Every destination needs a name.");
      }

      trip.destinations.splice(0);

      destinations.forEach((destination) => {
        trip.destinations.push(destination);
      });
    }

    /* ------------------------------- Route ------------------------------- */

    if (payload.route !== undefined) {
      trip.route = payload.route;
    }

    /* ------------------------------- Audit ------------------------------- */

    trip.auditLog.push({
      action: "TRIP_UPDATED",

      actor: getUserId(user),

      role: getUserRole(user),
    });

    await tripRepository.save(trip);

    return tripRepository.findById(trip._id);
  }

  /* ------------------------------------------------------------------------ */
  /* Start Trip                                                               */
  /* ------------------------------------------------------------------------ */

  async startTrip(tripId, payload, user) {
    const trip = await tripRepository.findById(tripId, {
      populate: false,
    });

    if (!trip) {
      throw new ApiError(404, "Trip not found.");
    }

    assertTripOwner(trip, user);

    if (trip.status !== "READY") {
      throw new ApiError(
        409,
        `Trip cannot be started from ${trip.status} status.`,
      );
    }

    const location = normalizeLocation(payload.location);

    if (!payload.meterImageUrl) {
      throw new ApiError(400, "Initial meter image is required.");
    }

    const meter = normalizeMeter(
      {
        reading: payload.meterReading,

        capturedAt: payload.meterCapturedAt,
      },
      payload.meterImageUrl,
    );

    trip.startLocation = location;

    trip.startMeter = meter;

    trip.status = "IN_PROGRESS";

    trip.startedAt = new Date();

    activateFirstDestination(trip);

    trip.currentLocation = {
      latitude: location.latitude,

      longitude: location.longitude,

      accuracy: location.accuracy,

      capturedAt: location.capturedAt,
    };

    trip.auditLog.push({
      action: "TRIP_STARTED",

      actor: getUserId(user),

      role: getUserRole(user),

      metadata: {
        latitude: location.latitude,

        longitude: location.longitude,

        meterReading: meter.reading,
      },
    });

    await tripRepository.save(trip);

    return tripRepository.findById(trip._id);
  }

  /* ------------------------------------------------------------------------ */
  /* Update Current Location                                                  */
  /* ------------------------------------------------------------------------ */

  async updateCurrentLocation(tripId, payload, user) {
    const trip = await tripRepository.findById(tripId, {
      populate: false,
    });

    if (!trip) {
      throw new ApiError(404, "Trip not found.");
    }

    assertTripOwner(trip, user);

    if (trip.status !== "IN_PROGRESS") {
      throw new ApiError(409, "Trip is not in progress.");
    }

    const location = normalizeLocation(payload.location);

    trip.currentLocation = {
      latitude: location.latitude,

      longitude: location.longitude,

      accuracy: location.accuracy,

      capturedAt: location.capturedAt,
    };

    await tripRepository.save(trip);

    return trip;
  }

  /* ------------------------------------------------------------------------ */
  /* Arrive At Destination                                                    */
  /* ------------------------------------------------------------------------ */

  async arriveAtDestination(tripId, destinationId, payload, user) {
    const trip = await tripRepository.findById(tripId, {
      populate: false,
    });

    if (!trip) {
      throw new ApiError(404, "Trip not found.");
    }

    assertTripOwner(trip, user);

    if (trip.status !== "IN_PROGRESS") {
      throw new ApiError(409, "Trip is not in progress.");
    }

    const destination = findDestination(trip, destinationId);

    if (destination.status === "COMPLETED") {
      throw new ApiError(409, "Destination is already completed.");
    }

    assertCurrentDestination(trip, destination);

    const location = normalizeLocation(payload.location);

    const distance = haversineDistanceMeters(
      location.latitude,
      location.longitude,
      destination.latitude,
      destination.longitude,
    );

    const radius =
      Number(destination.geofenceRadiusMeters) ||
      DEFAULT_GEOFENCE_RADIUS_METERS;

    if (distance > radius) {
      throw new ApiError(
        400,
        `You are ${Math.round(
          distance,
        )}m away from the destination. You must be within ${radius}m.`,
      );
    }

    destination.status = "ARRIVED";

    destination.arrival = {
      location: {
        latitude: location.latitude,

        longitude: location.longitude,

        accuracy: location.accuracy,

        capturedAt: location.capturedAt,
      },

      distanceFromDestinationMeters: Number(distance.toFixed(2)),
    };

    trip.currentLocation = {
      latitude: location.latitude,

      longitude: location.longitude,

      accuracy: location.accuracy,

      capturedAt: location.capturedAt,
    };

    trip.auditLog.push({
      action: "DESTINATION_ARRIVED",

      actor: getUserId(user),

      role: getUserRole(user),

      metadata: {
        destinationId,

        distanceMeters: Number(distance.toFixed(2)),
      },
    });

    await tripRepository.save(trip);

    return tripRepository.findById(trip._id);
  }

  /* ------------------------------------------------------------------------ */
  /* Submit Destination Evidence                                              */
  /* ------------------------------------------------------------------------ */

  async submitDestinationEvidence(tripId, destinationId, payload, files, user) {
    const trip = await tripRepository.findById(tripId, {
      populate: false,
    });

    if (!trip) {
      throw new ApiError(404, "Trip not found.");
    }

    assertTripOwner(trip, user);

    if (trip.status !== "IN_PROGRESS") {
      throw new ApiError(409, "Trip is not in progress.");
    }

    const destination = findDestination(trip, destinationId);

    if (!["ARRIVED", "CURRENT"].includes(destination.status)) {
      throw new ApiError(
        409,
        "Destination must be marked as arrived before submitting evidence.",
      );
    }

    const location = normalizeLocation(payload.location);

    const distance = haversineDistanceMeters(
      location.latitude,
      location.longitude,
      destination.latitude,
      destination.longitude,
    );

    const radius =
      Number(destination.geofenceRadiusMeters) ||
      DEFAULT_GEOFENCE_RADIUS_METERS;

    if (distance > radius) {
      throw new ApiError(
        400,
        `Evidence must be captured within ${radius}m of the destination.`,
      );
    }

    /* ------------------------------ Selfie ------------------------------- */

    const selfieImageUrl =
      files?.selfie?.[0]?.path ||
      files?.selfie?.[0]?.filename ||
      payload.selfieImageUrl ||
      "";

    /* --------------------------- Meter Image ----------------------------- */

    const meterImageUrl =
      files?.meterImage?.[0]?.path ||
      files?.meterImage?.[0]?.filename ||
      payload.meterImageUrl ||
      "";

    if (!selfieImageUrl) {
      throw new ApiError(400, "Destination geo-selfie is required.");
    }

    if (payload.meterReading === undefined || !meterImageUrl) {
      throw new ApiError(
        400,
        "Destination meter reading and meter image are both required.",
      );
    }

    /* ------------------------------- Meter ------------------------------- */

    destination.meter = normalizeMeter(
      {
        reading: payload.meterReading,

        imageUrl: meterImageUrl,

        capturedAt: payload.meterCapturedAt,
      },
      meterImageUrl,
    );

    /* ------------------------------- Selfie ------------------------------ */

    destination.selfie = {
      imageUrl: selfieImageUrl,

      location: {
        latitude: location.latitude,

        longitude: location.longitude,

        accuracy: location.accuracy,

        capturedAt: location.capturedAt,
      },

      capturedAt: location.capturedAt,
    };

    /* ------------------------- Current Location -------------------------- */

    trip.currentLocation = {
      latitude: location.latitude,

      longitude: location.longitude,

      accuracy: location.accuracy,

      capturedAt: location.capturedAt,
    };

    /* -------------------------------- Audit ------------------------------- */

    trip.auditLog.push({
      action: "DESTINATION_EVIDENCE_SUBMITTED",

      actor: getUserId(user),

      role: getUserRole(user),

      metadata: {
        destinationId,

        distanceMeters: Number(distance.toFixed(2)),

        hasSelfie: Boolean(selfieImageUrl),

        hasMeterImage: Boolean(meterImageUrl),
      },
    });

    await tripRepository.save(trip);

    return tripRepository.findById(trip._id);
  }

  /* ------------------------------------------------------------------------ */
  /* Add Fuel                                                                 */
  /* ------------------------------------------------------------------------ */

  async addFuel(tripId, destinationId, payload, files, user) {
    const trip = await tripRepository.findById(tripId, {
      populate: false,
    });

    if (!trip) {
      throw new ApiError(404, "Trip not found.");
    }

    assertTripOwner(trip, user);

    if (trip.status !== "IN_PROGRESS") {
      throw new ApiError(409, "Trip is not in progress.");
    }

    const destination = findDestination(trip, destinationId);

    if (!["ARRIVED", "CURRENT"].includes(destination.status)) {
      throw new ApiError(
        409,
        "Fuel can only be recorded at the current destination.",
      );
    }

    const litres = toNumber(payload.litres, "litres");

    const totalAmount = toNumber(payload.totalAmount, "totalAmount");

    if (litres <= 0) {
      throw new ApiError(400, "Litres must be greater than zero.");
    }

    if (totalAmount < 0) {
      throw new ApiError(400, "Fuel amount cannot be negative.");
    }

    const slipImageUrl =
      files?.fuelSlip?.[0]?.path ||
      files?.fuelSlip?.[0]?.filename ||
      payload.slipImageUrl ||
      "";

    const location = payload.location
      ? normalizeLocation(payload.location)
      : null;

    destination.fuelEntries.push({
      litres,

      totalAmount,

      slipImageUrl,

      location: location
        ? {
            latitude: location.latitude,

            longitude: location.longitude,

            accuracy: location.accuracy,

            capturedAt: location.capturedAt,
          }
        : undefined,

      capturedAt: new Date(),
    });

    recalculateTripTotals(trip);

    trip.auditLog.push({
      action: "FUEL_ADDED",

      actor: getUserId(user),

      role: getUserRole(user),

      metadata: {
        destinationId,

        litres,

        totalAmount,
      },
    });

    await tripRepository.save(trip);

    return tripRepository.findById(trip._id);
  }

  /* ------------------------------------------------------------------------ */
  /* Complete Destination                                                     */
  /* ------------------------------------------------------------------------ */

  async completeDestination(tripId, destinationId, user) {
    const trip = await tripRepository.findById(tripId, {
      populate: false,
    });

    if (!trip) {
      throw new ApiError(404, "Trip not found.");
    }

    assertTripOwner(trip, user);

    if (trip.status !== "IN_PROGRESS") {
      throw new ApiError(409, "Trip is not in progress.");
    }

    const destination = findDestination(trip, destinationId);

    assertCurrentDestination(trip, destination);

    if (destination.status !== "ARRIVED") {
      throw new ApiError(
        409,
        "Destination must be arrived at and verified before completion.",
      );
    }

    if (!destination.selfie?.imageUrl) {
      throw new ApiError(400, "Destination geo-selfie is required.");
    }

    if (
      destination.meter?.reading === undefined ||
      destination.meter?.reading === null
    ) {
      throw new ApiError(400, "Destination meter reading is required.");
    }

    destination.status = "COMPLETED";

    destination.completedAt = new Date();

    const nextDestination = trip.destinations.find(
      (item) => item.status === "PENDING",
    );

    if (nextDestination) {
      nextDestination.status = "CURRENT";
    }

    trip.auditLog.push({
      action: "DESTINATION_COMPLETED",

      actor: getUserId(user),

      role: getUserRole(user),

      metadata: {
        destinationId,
      },
    });

    recalculateTripTotals(trip);

    await tripRepository.save(trip);

    return tripRepository.findById(trip._id);
  }

  /* ------------------------------------------------------------------------ */
  /* Finalize Trip                                                            */
  /* ------------------------------------------------------------------------ */

  async finalizeTrip(tripId, payload, user) {
    const trip = await tripRepository.findById(tripId, {
      populate: false,
    });

    if (!trip) {
      throw new ApiError(404, "Trip not found.");
    }

    assertTripOwner(trip, user);

    if (trip.status !== "IN_PROGRESS") {
      throw new ApiError(409, "Trip is not in progress.");
    }

    const incompleteDestination = trip.destinations.find(
      (destination) => !["COMPLETED", "SKIPPED"].includes(destination.status),
    );

    if (incompleteDestination) {
      throw new ApiError(
        409,
        `Destination "${incompleteDestination.name}" is not completed.`,
      );
    }

    /* --------------------------- Final Location -------------------------- */

    if (payload.finalLocation) {
      const location = normalizeLocation(payload.finalLocation);

      trip.currentLocation = {
        latitude: location.latitude,

        longitude: location.longitude,

        accuracy: location.accuracy,

        capturedAt: location.capturedAt,
      };
    }

    /* ---------------------------- Final Meter ---------------------------- */

    if (
      payload.finalMeterReading === undefined ||
      !payload.finalMeterImageUrl
    ) {
      throw new ApiError(
        400,
        "Final meter reading and final meter image are both required.",
      );
    }

    trip.finalMeter = normalizeMeter(
      {
        reading: payload.finalMeterReading,

        imageUrl: payload.finalMeterImageUrl,

        capturedAt: payload.finalMeterCapturedAt,
      },
      payload.finalMeterImageUrl,
    );

    /* ------------------------------ Totals ------------------------------- */

    recalculateTripTotals(trip);

    /* ------------------------------ Status ------------------------------- */

    trip.status = "COMPLETED";

    trip.completedAt = new Date();

    /* -------------------------------- Audit ------------------------------- */

    trip.auditLog.push({
      action: "TRIP_COMPLETED",

      actor: getUserId(user),

      role: getUserRole(user),

      metadata: {
        finalMeterReading: trip.finalMeter.reading,

        totalDistanceKm: trip.totalDistanceKm,
      },
    });

    await tripRepository.save(trip);

    return tripRepository.findById(trip._id);
  }

  /* ------------------------------------------------------------------------ */
  /* Cancel Trip                                                              */
  /* ------------------------------------------------------------------------ */

  async cancelTrip(tripId, payload, user) {
    const trip = await tripRepository.findById(tripId, {
      populate: false,
    });

    if (!trip) {
      throw new ApiError(404, "Trip not found.");
    }

    assertTripOwner(trip, user);

    if (trip.status === "COMPLETED") {
      throw new ApiError(409, "Completed trips cannot be cancelled.");
    }

    trip.status = "CANCELLED";

    trip.cancelledAt = new Date();

    trip.cancellationReason = payload.reason?.trim?.() || "Cancelled";

    trip.auditLog.push({
      action: "TRIP_CANCELLED",

      actor: getUserId(user),

      role: getUserRole(user),

      reason: trip.cancellationReason,
    });

    await tripRepository.save(trip);

    return tripRepository.findById(trip._id);
  }
}

export default new TripService();
