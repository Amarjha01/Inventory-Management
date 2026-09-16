import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaCar,
  FaCheckCircle,
  FaClock,
  FaGasPump,
  FaTachometerAlt,
  FaImage,
  FaMapMarkerAlt,
  FaRoute,
  FaUser,
  FaTimesCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { MdRoute } from "react-icons/md";
import { FiXCircle } from "react-icons/fi";

import { getTripById } from "../../services/trip.service";
import TripMap from "../../components/trip/map/TripMap";
import GoogleMapProvider from "../../components/trip/map/GoogleMapProvider";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

const STATUS_STYLES = {
  DRAFT: {
    label: "Draft",
    className: "bg-gray-100 text-gray-700",
  },

  READY: {
    label: "Ready",
    className: "bg-blue-100 text-blue-700",
  },

  IN_PROGRESS: {
    label: "In Progress",
    className: "bg-amber-100 text-amber-700",
  },

  COMPLETED: {
    label: "Completed",
    className: "bg-green-100 text-green-700",
  },

  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700",
  },
};

const DESTINATION_STATUS_STYLES = {
  PENDING: "bg-gray-100 text-gray-700",
  CURRENT: "bg-blue-100 text-blue-700",
  ARRIVED: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-green-100 text-green-700",
  SKIPPED: "bg-gray-100 text-gray-500",
};

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const formatDate = (value, fallback = "-") => {
  if (!value) return fallback;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallback;
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatNumber = (value, decimals = 2) => {
  if (
    value === undefined ||
    value === null ||
    value === "" ||
    Number.isNaN(Number(value))
  ) {
    return "-";
  }

  return Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
};

const getPersonName = (driver) => {
  if (!driver) return "-";

  if (typeof driver === "string") {
    return driver;
  }

  return (
    driver.name ||
    driver.fullName ||
    `${driver.firstName || ""} ${driver.lastName || ""}`.trim() ||
    driver.phone ||
    driver._id ||
    "-"
  );
};

const getVehicleName = (vehicle) => {
  if (!vehicle) return "-";

  if (typeof vehicle === "string") {
    return vehicle;
  }

  return (
    vehicle.registrationNumber ||
    vehicle.vehicleNumber ||
    vehicle.number ||
    vehicle.name ||
    vehicle._id ||
    "-"
  );
};

const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "";

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("blob:")
  ) {
    return imageUrl;
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

  return `${baseUrl.replace(/\/$/, "")}/${imageUrl.replace(/^\//, "")}`;
};

/* -------------------------------------------------------------------------- */
/* Small Components                                                           */
/* -------------------------------------------------------------------------- */

const StatusBadge = ({ status }) => {
  const config = STATUS_STYLES[status] || {
    label: status || "Unknown",
    className: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
};

const DestinationStatus = ({ status }) => {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        DESTINATION_STATUS_STYLES[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status || "UNKNOWN"}
    </span>
  );
};

const InfoItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
        {Icon && <Icon size={17} />}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500">{label}</p>

        <p className="mt-0.5 break-words text-sm font-semibold text-gray-900">
          {value || "-"}
        </p>
      </div>
    </div>
  );
};

const Section = ({ title, icon: Icon, children, right }) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-5">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
              <Icon size={17} />
            </div>
          )}

          <h2 className="text-base font-bold text-gray-900">{title}</h2>
        </div>

        {right}
      </div>

      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
};

const ImagePreview = ({ src, alt, title }) => {
  if (!src) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50">
        <div className="text-center text-gray-400">
          <FaImage className="mx-auto mb-2" size={26} />

          <p className="text-xs">Image not available</p>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(src);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
      <img
        src={imageUrl}
        alt={alt || "Trip image"}
        className="aspect-video w-full object-cover"
        loading="lazy"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />

      {title && (
        <div className="border-t border-gray-100 px-3 py-2">
          <p className="text-xs font-medium text-gray-600">{title}</p>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Main Page                                                                  */
/* -------------------------------------------------------------------------- */

const TripDetails = () => {
  const { id: tripId } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Live GPS location.
   *
   * Shape:
   * {
   *   latitude,
   *   longitude,
   *   accuracy,
   *   capturedAt
   * }
   */
  const [currentLocation, setCurrentLocation] = useState(null);

  const [gpsError, setGpsError] = useState("");

  /* ------------------------------------------------------------------------ */
  /* Load Trip                                                                */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let mounted = true;

    const loadTrip = async () => {
      if (!tripId) {
        setError("Trip ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getTripById(tripId);

        if (mounted) {
          setTrip(data);
        }
      } catch (err) {
        if (!mounted) return;

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load trip.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadTrip();

    return () => {
      mounted = false;
    };
  }, [tripId]);

  /* ------------------------------------------------------------------------ */
  /* Live GPS Tracking                                                        */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    /*
     * Browser does not support geolocation.
     */
    if (!("geolocation" in navigator)) {
      setGpsError("Geolocation is not supported by this browser.");
      return undefined;
    }

    /*
     * Clear old error before starting watcher.
     */
    setGpsError("");

    const handlePosition = (position) => {
      const { latitude, longitude, accuracy } = position.coords;

      const location = {
        latitude,
        longitude,
        accuracy,
        capturedAt: new Date(position.timestamp).toISOString(),
      };

      setCurrentLocation(location);
    };

    const handleError = (geoError) => {
      console.error("GPS error:", geoError);

      let message = "Unable to get your current location.";

      switch (geoError.code) {
        case geoError.PERMISSION_DENIED:
          message = "Location permission was denied.";
          break;

        case geoError.POSITION_UNAVAILABLE:
          message = "Current location is unavailable.";
          break;

        case geoError.TIMEOUT:
          message = "Getting current location timed out.";
          break;

        default:
          message = "Unable to get your current location.";
      }

      setGpsError(message);
    };

    /*
     * Get the location immediately.
     */
    navigator.geolocation.getCurrentPosition(handlePosition, handleError, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 15000,
    });

    /*
     * Continue watching the location.
     */
    const watchId = navigator.geolocation.watchPosition(
      handlePosition,
      handleError,
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      },
    );

    /*
     * IMPORTANT:
     *
     * Clear the watcher when this component unmounts.
     * Otherwise the browser keeps tracking the location
     * and every remount can create another watcher.
     */
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Map Data                                                                 */
  /* ------------------------------------------------------------------------ */

  const destinations = useMemo(() => {
    if (!trip?.destinations) {
      return [];
    }

    return trip.destinations.map((destination) => ({
      ...destination,
      latitude: Number(destination.latitude),
      longitude: Number(destination.longitude),
    }));
  }, [trip]);

  const routeCoordinates = useMemo(() => {
    /*
     * TripMap expects:
     *
     * [
     *   [longitude, latitude],
     *   [longitude, latitude],
     *   ...
     * ]
     */
    return trip?.route?.geometry?.coordinates || trip?.route?.coordinates || [];
  }, [trip]);

  /*
   * Use live browser GPS location first.
   *
   * If browser GPS is not available yet, fall back to the
   * location saved in the trip returned by the backend.
   */
  const mapCurrentLocation = useMemo(() => {
    if (currentLocation) {
      return currentLocation;
    }

    if (!trip?.currentLocation) {
      return null;
    }

    return {
      latitude: trip.currentLocation.latitude,
      longitude: trip.currentLocation.longitude,
      accuracy: trip.currentLocation.accuracy,
      capturedAt: trip.currentLocation.capturedAt,
    };
  }, [currentLocation, trip]);

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                  */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-5 flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />

          <div className="space-y-2">
            <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        <div className="space-y-5">
          <div className="h-32 animate-pulse rounded-2xl bg-gray-200" />
          <div className="h-72 animate-pulse rounded-2xl bg-gray-200" />
          <div className="h-96 animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Error                                                                    */
  /* ------------------------------------------------------------------------ */

  if (error || !trip) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-xl items-center justify-center px-4">
        <div className="w-full rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
            <FiXCircle size={25} />
          </div>

          <h2 className="text-lg font-bold text-gray-900">
            Unable to load trip
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error || "Trip was not found."}
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mt-5 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Derived Values                                                           */
  /* ------------------------------------------------------------------------ */

  const driverName = getPersonName(trip.driver);

  const vehicleName = getVehicleName(trip.vehicle);

  const completedDestinations =
    trip.destinations?.filter(
      (destination) => destination.status === "COMPLETED",
    ).length || 0;

  const totalDestinations = trip.destinations?.length || 0;

  const totalFuelLitres =
    trip.totalFuelLitres ??
    trip.destinations?.reduce(
      (sum, destination) =>
        sum +
        (destination.fuelEntries || []).reduce(
          (fuelSum, fuel) => fuelSum + Number(fuel.litres || 0),
          0,
        ),
      0,
    );

  const totalFuelAmount =
    trip.totalFuelAmount ??
    trip.destinations?.reduce(
      (sum, destination) =>
        sum +
        (destination.fuelEntries || []).reduce(
          (fuelSum, fuel) => fuelSum + Number(fuel.totalAmount || 0),
          0,
        ),
      0,
    );

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50"
            aria-label="Go back"
          >
            <FaArrowLeft size={19} />
          </button>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Trip Details
              </h1>

              <StatusBadge status={trip.status} />
            </div>

            <p className="mt-1 text-xs text-gray-500">Trip ID: {trip._id}</p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          {trip.startedAt && <p className="text-xs text-gray-500">Started</p>}

          <p className="text-sm font-semibold text-gray-900">
            {formatDate(trip.startedAt || trip.createdAt)}
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Overview                                                            */}
      {/* ------------------------------------------------------------------ */}

      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <InfoItem icon={FaUser} label="Driver" value={driverName} />

          <InfoItem icon={FaCar} label="Vehicle" value={vehicleName} />

          <InfoItem
            icon={MdRoute}
            label="Distance"
            value={
              trip.totalDistanceKm !== undefined &&
              trip.totalDistanceKm !== null
                ? `${formatNumber(trip.totalDistanceKm)} km`
                : "-"
            }
          />

          <InfoItem
            icon={FaGasPump}
            label="Fuel"
            value={
              totalFuelLitres !== undefined && totalFuelLitres !== null
                ? `${formatNumber(totalFuelLitres, 3)} L`
                : "-"
            }
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs text-gray-500">Destinations</p>

            <p className="mt-1 text-lg font-bold text-gray-900">
              {completedDestinations}

              <span className="ml-1 text-sm font-medium text-gray-400">
                / {totalDestinations}
              </span>
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs text-gray-500">Fuel Cost</p>

            <p className="mt-1 text-lg font-bold text-gray-900">
              ₹{formatNumber(totalFuelAmount)}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs text-gray-500">Duration</p>

            <p className="mt-1 text-sm font-bold text-gray-900">
              {trip.startedAt
                ? trip.completedAt
                  ? `${formatDate(trip.startedAt)} → ${formatDate(
                      trip.completedAt,
                    )}`
                  : "Trip in progress"
                : "Not started"}
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Map                                                                 */}
      {/* ------------------------------------------------------------------ */}

      <Section title="Trip Route" icon={FaRoute}>
        <GoogleMapProvider>
          <TripMap
          driver={trip.driver.name}
          currentLocation={mapCurrentLocation}
          destinations={destinations}
          route={routeCoordinates}
          activeDestinationId={
            trip.destinations?.find(
              (destination) => destination.status === "CURRENT",
            )?._id
          }
          height="480px"
        />
        </GoogleMapProvider>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            Current location
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-gray-500" />
            Destination
          </div>

          {mapCurrentLocation?.capturedAt && (
            <span>
              Last GPS update: {formatDate(mapCurrentLocation.capturedAt)}
            </span>
          )}
        </div>

        {currentLocation && (
          <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
            <div className="flex flex-col gap-2 text-xs text-blue-800 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Live GPS:{" "}
                <strong>
                  {currentLocation.latitude}, {currentLocation.longitude}
                </strong>
              </span>

              <span>
                Accuracy: ±
                <strong>{formatNumber(currentLocation.accuracy)}m</strong>
              </span>
            </div>
          </div>
        )}

        {gpsError && !currentLocation && (
          <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs text-amber-700">
            {gpsError}
          </div>
        )}
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* Start Information                                                   */}
      {/* ------------------------------------------------------------------ */}

      <Section
        title="Trip Start"
        icon={FaRoute}
        right={
          trip.startedAt && (
            <span className="text-xs text-gray-500">
              {formatDate(trip.startedAt)}
            </span>
          )
        }
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="space-y-4">
            <InfoItem
              icon={FaMapMarkerAlt}
              label="Start Address"
              value={
                trip.startLocation?.address ||
                `${trip.startLocation?.latitude ?? "-"}, ${
                  trip.startLocation?.longitude ?? "-"
                }`
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <InfoItem
                icon={FaTachometerAlt}
                label="Initial Meter"
                value={
                  trip.startMeter?.reading !== undefined
                    ? formatNumber(trip.startMeter.reading)
                    : "-"
                }
              />

              <InfoItem
                icon={FaClock}
                label="Captured"
                value={formatDate(trip.startMeter?.capturedAt)}
              />
            </div>

            {trip.startLocation && (
              <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
                <p>
                  Latitude:{" "}
                  <span className="font-semibold">
                    {trip.startLocation.latitude}
                  </span>
                </p>

                <p className="mt-1">
                  Longitude:{" "}
                  <span className="font-semibold">
                    {trip.startLocation.longitude}
                  </span>
                </p>

                {trip.startLocation.accuracy !== undefined && (
                  <p className="mt-1">
                    Accuracy:{" "}
                    <span className="font-semibold">
                      ±{formatNumber(trip.startLocation.accuracy)}m
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>

          <ImagePreview
            src={trip.startMeter?.imageUrl}
            alt="Initial meter reading"
            title="Initial meter reading"
          />
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* Destinations                                                        */}
      {/* ------------------------------------------------------------------ */}

      <Section
        title="Destinations"
        icon={FaMapMarkerAlt}
        right={
          <span className="text-xs font-medium text-gray-500">
            {completedDestinations}/{totalDestinations} completed
          </span>
        }
      >
        <div className="space-y-5">
          {destinations.map((destination, index) => {
            const arrivalLocation = destination.arrival?.location;

            const selfieUrl = destination.selfie?.imageUrl;

            const meterImageUrl = destination.meter?.imageUrl;

            const fuelEntries = destination.fuelEntries || [];

            return (
              <div
                key={destination._id || index}
                className="overflow-hidden rounded-2xl border border-gray-200"
              >
                {/* Destination Header */}

                <div className="flex flex-col gap-3 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                      {index + 1}
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900">
                        {destination.name || "Destination"}
                      </h3>

                      {destination.address && (
                        <p className="mt-1 text-xs text-gray-500">
                          {destination.address}
                        </p>
                      )}
                    </div>
                  </div>

                  <DestinationStatus status={destination.status} />
                </div>

                <div className="space-y-5 p-4">
                  {/* Destination Coordinates */}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <InfoItem
                      icon={FaMapMarkerAlt}
                      label="Coordinates"
                      value={`${destination.latitude}, ${destination.longitude}`}
                    />

                    <InfoItem
                      icon={FaRoute}
                      label="Geofence"
                      value={`${formatNumber(
                        destination.geofenceRadiusMeters,
                      )} m`}
                    />

                    <InfoItem
                      icon={FaClock}
                      label="Completed"
                      value={formatDate(destination.completedAt)}
                    />
                  </div>

                  {/* Arrival */}

                  {destination.arrival && (
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                      <h4 className="mb-3 text-sm font-bold text-gray-900">
                        Arrival Verification
                      </h4>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <InfoItem
                          icon={FaMapMarkerAlt}
                          label="Arrival Location"
                          value={
                            arrivalLocation
                              ? `${arrivalLocation.latitude}, ${arrivalLocation.longitude}`
                              : "-"
                          }
                        />

                        <InfoItem
                          icon={FaRoute}
                          label="Distance From Destination"
                          value={
                            destination.arrival
                              ?.distanceFromDestinationMeters !== undefined
                              ? `${formatNumber(
                                  destination.arrival
                                    .distanceFromDestinationMeters,
                                )} m`
                              : "-"
                          }
                        />

                        <InfoItem
                          icon={FaClock}
                          label="Arrived At"
                          value={formatDate(
                            destination.arrival?.arrivedAt ||
                              arrivalLocation?.capturedAt,
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Evidence */}

                  {(selfieUrl ||
                    meterImageUrl ||
                    destination.meter?.reading !== undefined) && (
                    <div>
                      <h4 className="mb-3 text-sm font-bold text-gray-900">
                        Destination Evidence
                      </h4>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <ImagePreview
                          src={selfieUrl}
                          alt="Destination geo selfie"
                          title="Geo-selfie"
                        />

                        <ImagePreview
                          src={meterImageUrl}
                          alt="Destination meter"
                          title="Meter reading"
                        />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <InfoItem
                          icon={FaTachometerAlt}
                          label="Meter Reading"
                          value={
                            destination.meter?.reading !== undefined
                              ? formatNumber(destination.meter.reading)
                              : "-"
                          }
                        />

                        <InfoItem
                          icon={FaClock}
                          label="Meter Captured"
                          value={formatDate(destination.meter?.capturedAt)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Fuel */}

                  {fuelEntries.length > 0 && (
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-bold text-gray-900">
                          Fuel Entries
                        </h4>

                        <span className="text-xs text-gray-500">
                          {fuelEntries.length}{" "}
                          {fuelEntries.length === 1 ? "entry" : "entries"}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {fuelEntries.map((fuel, fuelIndex) => (
                          <div
                            key={fuel._id || fuelIndex}
                            className="rounded-xl border border-gray-200 p-4"
                          >
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                              <InfoItem
                                icon={FaGasPump}
                                label="Litres"
                                value={`${formatNumber(fuel.litres, 3)} L`}
                              />

                              <InfoItem
                                icon={FaTachometerAlt}
                                label="Amount"
                                value={`₹${formatNumber(fuel.totalAmount)}`}
                              />

                              <InfoItem
                                icon={FaClock}
                                label="Captured"
                                value={formatDate(fuel.capturedAt)}
                              />

                              <InfoItem
                                icon={FaMapMarkerAlt}
                                label="Location"
                                value={
                                  fuel.location
                                    ? `${fuel.location.latitude}, ${fuel.location.longitude}`
                                    : "-"
                                }
                              />
                            </div>

                            {fuel.slipImageUrl && (
                              <div className="mt-4 max-w-sm">
                                <ImagePreview
                                  src={fuel.slipImageUrl}
                                  alt="Fuel slip"
                                  title="Fuel slip"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {!destinations.length && (
            <div className="py-10 text-center text-sm text-gray-500">
              No destinations found.
            </div>
          )}
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      {/* Final Trip Information                                              */}
      {/* ------------------------------------------------------------------ */}

      {trip.finalMeter && (
        <Section
          title="Trip Finalization"
          icon={FaCheckCircle}
          right={
            trip.completedAt && (
              <span className="text-xs text-gray-500">
                {formatDate(trip.completedAt)}
              </span>
            )
          }
        >
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  icon={FaTachometerAlt}
                  label="Final Meter"
                  value={formatNumber(trip.finalMeter.reading)}
                />

                <InfoItem
                  icon={FaRoute}
                  label="Total Distance"
                  value={
                    trip.totalDistanceKm !== undefined
                      ? `${formatNumber(trip.totalDistanceKm)} km`
                      : "-"
                  }
                />
              </div>

              <InfoItem
                icon={FaClock}
                label="Final Meter Captured"
                value={formatDate(trip.finalMeter.capturedAt)}
              />

              {mapCurrentLocation && (
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="text-xs font-medium text-gray-500">
                    Current GPS Location
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {mapCurrentLocation.latitude},{" "}
                    {mapCurrentLocation.longitude}
                  </p>
                </div>
              )}
            </div>

            <ImagePreview
              src={trip.finalMeter.imageUrl}
              alt="Final meter reading"
              title="Final meter reading"
            />
          </div>
        </Section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Cancellation                                                        */}
      {/* ------------------------------------------------------------------ */}

      {trip.status === "CANCELLED" && (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-4 sm:p-5">
          <div className="flex gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <FaTimesCircle size={18} />
            </div>

            <div>
              <h3 className="font-bold text-red-900">Trip Cancelled</h3>

              <p className="mt-1 text-sm text-red-700">
                {trip.cancellationReason || "No cancellation reason provided."}
              </p>

              {trip.cancelledAt && (
                <p className="mt-2 text-xs text-red-600">
                  Cancelled on {formatDate(trip.cancelledAt)}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Audit Timeline                                                      */}
      {/* ------------------------------------------------------------------ */}

      {trip.auditLog?.length > 0 && (
        <Section title="Trip Timeline" icon={FaClock}>
          <div className="relative">
            <div className="absolute bottom-0 left-[7px] top-0 w-px bg-gray-200" />

            <div className="space-y-5">
              {[...trip.auditLog].reverse().map((event, index) => (
                <div key={event._id || index} className="relative flex gap-4">
                  <div className="relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-4 border-white bg-gray-700 shadow-sm" />

                  <div className="min-w-0 flex-1 rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-bold text-gray-900">
                        {String(event.action || "EVENT")
                          .replace(/_/g, " ")
                          .toLowerCase()
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </p>

                      <p className="text-xs text-gray-500">
                        {formatDate(
                          event.createdAt || event.timestamp || event.at,
                        )}
                      </p>
                    </div>

                    {event.reason && (
                      <p className="mt-1 text-xs text-gray-600">
                        Reason: {event.reason}
                      </p>
                    )}

                    {event.metadata && (
                      <pre className="mt-2 overflow-x-auto rounded-lg bg-white p-2 text-[11px] text-gray-500">
                        {JSON.stringify(event.metadata, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Footer                                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex justify-start pb-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <FaArrowLeft size={17} />
          Back
        </button>
      </div>
    </div>
  );
};

export default TripDetails;
