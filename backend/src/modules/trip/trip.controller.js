import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import tripService from "./trip.service.js";
import Trip from "./trip.model.js";
import { generateGpsTrackingToken } from "../../utils/jwt.js";
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

  const destinations = parseJsonField(req.body.destinations, "destinations");

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

  const trip = await tripService.createTrip(payload, req.user);

  return ApiResponse.success(res, "Trip created successfully.", trip);
});

export const getMyTrips = asyncHandler(async (req, res) => {
  const result = await tripService.getMyTrips(
    req.user,
    getPagination(req.query),
  );

  return ApiResponse.success(res, "Trips fetched successfully.", result);
});

export const getTripById = asyncHandler(async (req, res) => {
  const trip = await tripService.getTripById(req.params.tripId, req.user);

  return ApiResponse.success(res, "Trip fetched successfully.", trip);
});

export const updateTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.updateTrip(
    req.params.tripId,
    req.body,
    req.user,
  );

  return ApiResponse.success(res, "Trip updated successfully.", trip);
});

export const startTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.startTrip(req.params.tripId, req.user);

  return ApiResponse.success(res, "Trip started successfully.", trip);
});

export const updateCurrentLocation = asyncHandler(async (req, res) => {
  const location = req.body;
  console.log("location", location);

  const trip = await tripService.updateCurrentLocation(
    req.params.tripId,
    location,
    req.user,
  );

  return ApiResponse.success(
    res,
    "Current location updated successfully.",
    trip,
  );
});

export const arriveAtDestination = asyncHandler(async (req, res) => {
  console.log(
    req.params.tripId,
    req.params.destinationId,
    req.body,
    req.user,
    req.files,
  );

  const trip = await tripService.arriveAtDestination(
    req.params.tripId,
    req.params.destinationId,
    req.body,
    req.user,
  );

  return ApiResponse.success(
    res,
    "Destination arrival verified successfully.",
    trip,
  );
});

export const submitDestinationEvidence = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    selfieImageUrl: req.body.selfieImageUrl || getFileUrl(req.files, "selfie"),
    meterImageUrl:
      req.body.meterImageUrl || getFileUrl(req.files, "meterImage"),
  };

  const trip = await tripService.submitDestinationEvidence(
    req.params.tripId,
    req.params.destinationId,
    payload,
    req.files,
    req.user,
  );

  return ApiResponse.success(
    res,
    "Destination evidence submitted successfully.",
    trip,
  );
});

export const addFuel = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    slipImageUrl: req.body.slipImageUrl || getFileUrl(req.files, "fuelSlip"),
  };

  const trip = await tripService.addFuel(
    req.params.tripId,
    req.params.destinationId,
    payload,
    req.files,
    req.user,
  );

  return ApiResponse.success(res, "Fuel entry added successfully.", trip);
});

export const completeDestination = asyncHandler(async (req, res) => {
  const trip = await tripService.completeDestination(
    req.params.tripId,
    req.params.destinationId,
    req.user,
  );

  return ApiResponse.success(res, "Destination completed successfully.", trip);
});

export const finalizeTrip = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    finalMeterImageUrl:
      req.body.finalMeterImageUrl || getFileUrl(req.files, "finalMeterImage"),
  };

  const trip = await tripService.finalizeTrip(
    req.params.tripId,
    payload,
    req.user,
  );

  return ApiResponse.success(res, "Trip completed successfully.", trip);
});

export const cancelTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.cancelTrip(
    req.params.tripId,
    req.body,
    req.user,
  );

  return ApiResponse.success(res, "Trip cancelled successfully.", trip);
});

// export const gpsTrail = asyncHandler(async(req , res)=>{
//   const tripId = req.params.tripId
//   const payload = {...req.body}

//   console.log("req.params.tripId" , req.params.tripId  );
//   const trip = await tripService.createGpsTrail(tripId , payload);

//   return ApiResponse.success(
//     res,
//     "gps trail recorded successfully",

//   )
// });

export const gpsTrail = asyncHandler(async (req, res) => {
  const { tripId } = req.params;

  const body = req.body?.gpsCoordinates ?? req.body;

  const capturedAt =
    body?.capturedAt ?? (body?.time ? new Date(body.time) : new Date());

  const gpsCoordinates = {
    latitude: body?.latitude,
    longitude: body?.longitude,
    accuracy: body?.accuracy,
    capturedAt,
  };

  const trip = await tripService.createGpsTrail(req.user, tripId, {
    gpsCoordinates,
  });

  return ApiResponse.success(res, "GPS trail recorded successfully", trip);
});

export const createGpsTrackingToken = asyncHandler(async (req, res) => {
  const { tripId } = req.params;

  const trip = await Trip.findById(tripId).select("driver status");

  if (!trip) {
    throw new ApiError(404, "Trip not found");
  }

  if (!trip.driver.equals(req.user._id)) {
    throw new ApiError(403, "You are not assigned to this trip");
  }

  if (trip.status !== "IN_PROGRESS") {
    throw new ApiError(409, "GPS tracking requires an active trip");
  }

  const token = generateGpsTrackingToken(req.user._id, trip._id);

  return ApiResponse.success(res, "GPS tracking token issued", {
    token,
    expiresIn: 86400,
  });
});

// ADMIN

export const getAllTrips = asyncHandler(async (req, res) => {
  const result = await tripService.getAllTrips(req.user, {
    ...getPagination(req.query),
    driverId: req.query.driverId || undefined,
    vehicleId: req.query.vehicleId || undefined,
  });

  return ApiResponse.success(res, "Trips fetched successfully.", result);
});

export const getAdminTripSummary = async (req, res, next) => {
  try {
    const summary = await tripService.getAdminTripSummary(req.query);
    return ApiResponse.success(
      res,
      "Trip summary fetched successfully.",
      summary,
    );
  } catch (error) {
    return next(error);
  }
};

export const getAdminTripById = async (req, res, next) => {
  try {
    const trip = await tripService.getAdminTripById(req.params.tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    return ApiResponse.success(res, "Trip fetched successfully.", trip);
  } catch (error) {
    return next(error);
  }
};

export const getAdminTripGpsTrail = async (req, res, next) => {
  try {
    const trail = await tripService.getAdminTripGpsTrail(req.params.tripId);

    if (!trail) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }

    return ApiResponse.success(
      res,
      "Trip GPS trail fetched successfully.",
      trail,
    );
  } catch (error) {
    return next(error);
  }
};
