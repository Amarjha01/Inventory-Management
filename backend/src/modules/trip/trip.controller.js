import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import tripService from "./trip.service.js";

const getPagination = (query = {}) => ({
  page: Math.max(Number(query.page) || 1, 1),
  limit: Math.min(Math.max(Number(query.limit) || 20, 1), 100),
  status: query.status || undefined,
});

const getFileUrl = (files, fieldName) => {
  const file = files?.[fieldName]?.[0];

  if (!file) return "";

  // Supports the common multer fields used by this project.
  return file.path || file.location || file.filename || "";
};

const parseJsonField = (value, fieldName) => {
  if (value === undefined || value === null || value === "") {
    return value;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    throw new ApiError(400, `${fieldName} must contain valid JSON.`);
  }
};

export const createTrip = asyncHandler(async (req, res) => {
  const startMeter = parseJsonField(req.body.startMeter, "startMeter");

  const destinations = parseJsonField(
    req.body.destinations,
    "destinations"
  );

  const route = req.body.route
    ? parseJsonField(req.body.route, "route")
    : undefined;

  const startLocation = req.body.startLocation
    ? parseJsonField(req.body.startLocation, "startLocation")
    : undefined;

  const startMeterImg = req.file?.filename;

  const payload = {
    ...req.body,

    startLocation,

    destinations,

    ...(route !== undefined && { route }),

    startMeter: {
      imageUrl: startMeterImg,
      reading: Number(startMeter.reading),
    },
  };

  console.log(payload);

  const trip = await tripService.createTrip(
    payload,
    req.user
  );

  return ApiResponse.success(
    res,
    "Trip created successfully.",
    trip
  );
});

export const getMyTrips = asyncHandler(async (req, res) => {
  const result = await tripService.getMyTrips(
    req.user,
    getPagination(req.query)
  );

  return ApiResponse.success(
    res,
    "Trips fetched successfully.",
    result
  );
});

export const getAllTrips = asyncHandler(async (req, res) => {
  const result = await tripService.getAllTrips(req.user, {
    ...getPagination(req.query),
    driverId: req.query.driverId || undefined,
    vehicleId: req.query.vehicleId || undefined,
  });

  return ApiResponse.success(
    res,
    "Trips fetched successfully.",
    result
  );
});

export const getTripById = asyncHandler(async (req, res) => {
  const trip = await tripService.getTripById(
    req.params.tripId,
    req.user
  );

  return ApiResponse.success(
    res,
    "Trip fetched successfully.",
    trip
  );
});

export const updateTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.updateTrip(
    req.params.tripId,
    req.body,
    req.user
  );

  return ApiResponse.success(
    res,
    "Trip updated successfully.",
    trip
  );
});

export const startTrip = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    meterImageUrl:
      req.body.meterImageUrl ||
      getFileUrl(req.files, "meterImage"),
  };

  const trip = await tripService.startTrip(
    req.params.tripId,
    payload,
    req.user
  );

  return ApiResponse.success(
    res,
    "Trip started successfully.",
    trip
  );
});

export const updateCurrentLocation = asyncHandler(
  async (req, res) => {
    const trip = await tripService.updateCurrentLocation(
      req.params.tripId,
      req.body,
      req.user
    );

    return ApiResponse.success(
      res,
      "Current location updated successfully.",
      trip
    );
  }
);

export const arriveAtDestination = asyncHandler(
  async (req, res) => {
    const trip = await tripService.arriveAtDestination(
      req.params.tripId,
      req.params.destinationId,
      req.body,
      req.user
    );

    return ApiResponse.success(
      res,
      "Destination arrival verified successfully.",
      trip
    );
  }
);

export const submitDestinationEvidence = asyncHandler(
  async (req, res) => {
    const payload = {
      ...req.body,
      selfieImageUrl:
        req.body.selfieImageUrl ||
        getFileUrl(req.files, "selfie"),
      meterImageUrl:
        req.body.meterImageUrl ||
        getFileUrl(req.files, "meterImage"),
    };

    const trip = await tripService.submitDestinationEvidence(
      req.params.tripId,
      req.params.destinationId,
      payload,
      req.files,
      req.user
    );

    return ApiResponse.success(
      res,
      "Destination evidence submitted successfully.",
      trip
    );
  }
);

export const addFuel = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    slipImageUrl:
      req.body.slipImageUrl ||
      getFileUrl(req.files, "fuelSlip"),
  };

  const trip = await tripService.addFuel(
    req.params.tripId,
    req.params.destinationId,
    payload,
    req.files,
    req.user
  );

  return ApiResponse.success(
    res,
    "Fuel entry added successfully.",
    trip
  );
});

export const completeDestination = asyncHandler(
  async (req, res) => {
    const trip = await tripService.completeDestination(
      req.params.tripId,
      req.params.destinationId,
      req.user
    );

    return ApiResponse.success(
      res,
      "Destination completed successfully.",
      trip
    );
  }
);

export const finalizeTrip = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    finalMeterImageUrl:
      req.body.finalMeterImageUrl ||
      getFileUrl(req.files, "finalMeterImage"),
  };

  const trip = await tripService.finalizeTrip(
    req.params.tripId,
    payload,
    req.user
  );

  return ApiResponse.success(
    res,
    "Trip completed successfully.",
    trip
  );
});

export const cancelTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.cancelTrip(
    req.params.tripId,
    req.body,
    req.user
  );

  return ApiResponse.success(
    res,
    "Trip cancelled successfully.",
    trip
  );
});