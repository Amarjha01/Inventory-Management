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
  const payload = {
    ...req.body,
    destinations: parseJsonField(req.body.destinations, "destinations"),
    route: parseJsonField(req.body.route, "route"),
  };
  console.log(payload);
  
  const trip = await tripService.createTrip(payload, req.user);

  return res
    .status(201)
    .json(new ApiResponse(201, trip, "Trip created successfully."));
});

export const getMyTrips = asyncHandler(async (req, res) => {
  const result = await tripService.getMyTrips(
    req.user,
    getPagination(req.query)
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, result, "Trips fetched successfully.")
    );
});

export const getAllTrips = asyncHandler(async (req, res) => {
  const result = await tripService.getAllTrips(req.user, {
    ...getPagination(req.query),
    driverId: req.query.driverId || undefined,
    vehicleId: req.query.vehicleId || undefined,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, result, "Trips fetched successfully.")
    );
});

export const getTripById = asyncHandler(async (req, res) => {
  const trip = await tripService.getTripById(
    req.params.tripId,
    req.user
  );

  return res
    .status(200)
    .json(new ApiResponse(200, trip, "Trip fetched successfully."));
});

export const updateTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.updateTrip(
    req.params.tripId,
    req.body,
    req.user
  );

  return res
    .status(200)
    .json(new ApiResponse(200, trip, "Trip updated successfully."));
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

  return res
    .status(200)
    .json(new ApiResponse(200, trip, "Trip started successfully."));
});

export const updateCurrentLocation = asyncHandler(
  async (req, res) => {
    const trip = await tripService.updateCurrentLocation(
      req.params.tripId,
      req.body,
      req.user
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          trip,
          "Current location updated successfully."
        )
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

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          trip,
          "Destination arrival verified successfully."
        )
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

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          trip,
          "Destination evidence submitted successfully."
        )
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

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        trip,
        "Fuel entry added successfully."
      )
    );
});

export const completeDestination = asyncHandler(
  async (req, res) => {
    const trip = await tripService.completeDestination(
      req.params.tripId,
      req.params.destinationId,
      req.user
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          trip,
          "Destination completed successfully."
        )
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

  return res
    .status(200)
    .json(new ApiResponse(200, trip, "Trip completed successfully."));
});

export const cancelTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.cancelTrip(
    req.params.tripId,
    req.body,
    req.user
  );

  return res
    .status(200)
    .json(new ApiResponse(200, trip, "Trip cancelled successfully."));
});
