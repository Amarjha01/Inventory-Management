import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  MdArrowBack,
  MdCheck,
  MdMyLocation,
  MdOutlineSpeed,
  MdCameraAlt,
  MdLocalGasStation,
  MdNavigation,
  MdWarning,
} from "react-icons/md";
import { FaRoute, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  getTripById,
  updateTripLocation,
  completeDestination,
  completeTrip,
  startTrip,
  createGpsTrail,
} from "../../services/trip.service";

import TripMap from "../../components/trip/map/TripMap";
import GoogleMapProvider from "../../components/trip/map/GoogleMapProvider";
import toast from "react-hot-toast";

import { Capacitor } from "@capacitor/core";

import {
  startBackgroundGpsTracking,
  stopBackgroundGpsTracking,
} from "../../services/backgroundTracking.js";

const MAX_DESTINATION_DISTANCE_METERS = 200;
const MAX_GPS_ACCURACY_METERS = 100;

const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const earthRadiusMeters = 6_371_000;

  const latitudeDifference = toRadians(lat2 - lat1);
  const longitudeDifference = toRadians(lon2 - lon1);

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(longitudeDifference / 2) ** 2;

  return 2 * earthRadiusMeters * Math.asin(Math.sqrt(Math.min(1, a)));
};

/* -------------------------------------------------------------------------- */
/* Sub-component: EvidenceCard                                                */
/* -------------------------------------------------------------------------- */

const EvidenceCard = ({ icon, title, description, children }) => (
  <div className="mb-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
    <div className="mb-3 flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#1f225f] shadow-sm">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>

    {children}
  </div>
);

/* -------------------------------------------------------------------------- */
/* Main Component: ActiveTrip                                                 */
/* -------------------------------------------------------------------------- */

const ActiveTrip = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("tripId");

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [gpsError, setGpsError] = useState("");

  const [meterReading, setMeterReading] = useState("");
  const [selfie, setSelfie] = useState(null);
  const [meterImage, setMeterImage] = useState(null);

  const [fuelEntries, setFuelEntries] = useState([]);
  const [fuelLitres, setFuelLitres] = useState("");
  const [fuelAmount, setFuelAmount] = useState("");
  const [fuelSlip, setFuelSlip] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [startingTrip, setStartingTrip] = useState(false);

  // Prevent overlapping GPS requests.
  const gpsRequestInFlight = useRef(false);

  // Prevent state updates after the component unmounts.
  const mountedRef = useRef(false);

  /* ------------------------------------------------------------------------ */
  /* Load Trip                                                                */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!tripId) {
      setTrip(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadTrip = async () => {
      try {
        setLoading(true);

        const response = await getTripById(tripId);

        if (!cancelled) {
          setTrip(response);
        }
      } catch (error) {
        console.error("getTripById failed:", error);

        if (!cancelled) {
          toast.error(error?.response?.data?.message || "Unable to load trip.");
          setTrip(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadTrip();

    return () => {
      cancelled = true;
    };
  }, [tripId]);

  /* ------------------------------------------------------------------------ */
  /* Derived Map Data                                                         */
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
  }, [trip?.destinations]);

  const routeCoordinates = useMemo(() => {
    return trip?.route?.geometry?.coordinates || trip?.route?.coordinates || [];
  }, [trip?.route]);

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
  }, [currentLocation, trip?.currentLocation]);

  const currentDestination = useMemo(() => {
    if (!trip?.destinations) {
      return null;
    }

    return (
      trip.destinations.find(
        (destination) => destination.status === "CURRENT",
      ) ||
      trip.destinations.find(
        (destination) => destination.status === "PENDING",
      ) ||
      null
    );
  }, [trip?.destinations]);

  const completedCount =
    trip?.destinations?.filter(
      (destination) => destination.status === "COMPLETED",
    ).length || 0;

  const destinationCount = trip?.destinations?.length || 0;

  const allDestinationsCompleted = completedCount === destinationCount;
  console.log(
    "completedCount",
    completedCount,
    "destinationCount",
    destinationCount,
    allDestinationsCompleted,
  );

  /* ------------------------------------------------------------------------ */
  /* GPS Error Handler                                                        */
  /* ------------------------------------------------------------------------ */

  const handleGpsError = useCallback((error) => {
    console.error("GPS error:", error);

    let message = "Unable to get your current location.";

    switch (error?.code) {
      case 1:
        message = "Location permission was denied.";
        break;
      case 2:
        message = "Current location is unavailable.";
        break;
      case 3:
        message = "Getting current location timed out.";
        break;
      default:
        message = "Unable to get your current location.";
    }

    if (mountedRef.current) {
      setGpsError(message);
    }
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Background GPS Tracing                                                      */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!Capacitor.isNativePlatform() || !tripId || !trip) {
      return undefined;
    }

    let cancelled = false;

    const manageTracking = async () => {
      if (trip.status !== "IN_PROGRESS") {
        await stopBackgroundGpsTracking();
        return;
      }

      await startBackgroundGpsTracking(tripId, (location) => {
        if (cancelled || !mountedRef.current) return;

        setCurrentLocation(location);
        setGpsError("");
      });
    };

    manageTracking().catch((error) => {
      console.error("GPS startup failed:", {
        message: error.message,
        status: error.response?.status,
        response: error.response?.data,
        requestUrl: error.config?.url,
        method: error.config?.method,
      });

      if (!cancelled && mountedRef.current) {
        setGpsError(
          error.response?.data?.message ||
            error.message ||
            "Unable to start background GPS tracking.",
        );
      }
    });

    // Do not stop tracking when this page unmounts.
    return () => {
      cancelled = true;
    };
  }, [tripId, trip?.status]);

  /* ------------------------------------------------------------------------ */
  /* Manual GPS Capture                                                       */
  /* ------------------------------------------------------------------------ */

  const captureLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      toast.error("Geolocation is not supported by this browser.");
      return;
    }

    if (locationLoading) {
      return;
    }

    setLocationLoading(true);
    setGpsError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          capturedAt: new Date(position.timestamp).toISOString(),
        };

        if (mountedRef.current) {
          setCurrentLocation(location);
        }

        try {
          await updateTripLocation(tripId, location);

          if (mountedRef.current) {
            toast.success("GPS location captured.");
          }
        } catch (error) {
          console.error("Manual location update failed:", error);

          if (mountedRef.current) {
            toast.error(
              error?.response?.data?.message ||
                "Location captured, but server update failed.",
            );
          }
        } finally {
          if (mountedRef.current) {
            setLocationLoading(false);
          }
        }
      },
      (error) => {
        handleGpsError(error);
        toast.error("Unable to get your current location.");

        if (mountedRef.current) {
          setLocationLoading(false);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  }, [tripId, locationLoading, handleGpsError]);

  /* ------------------------------------------------------------------------ */
  /* Start Trip                                                               */
  /* ------------------------------------------------------------------------ */

  const handleStart = async () => {
    if (!tripId || startingTrip) {
      return;
    }

    try {
      setStartingTrip(true);

      const response = await startTrip(tripId);

      // Support APIs returning either a status directly or a trip object.
      const newStatus =
        response?.trip?.status || response?.status || "IN_PROGRESS";

      setTrip((previous) => {
        if (!previous) {
          return previous;
        }

        return {
          ...previous,
          ...(response?.trip || {}),
          status: newStatus,
        };
      });

      toast.success(response?.message || "Trip started.");
    } catch (error) {
      console.error("Start trip failed:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to start trip.",
      );
    } finally {
      setStartingTrip(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* File Handlers                                                            */
  /* ------------------------------------------------------------------------ */

  const handleSelfie = (event) => {
    const file = event.target.files?.[0];
    if (file) setSelfie(file);
  };

  const handleMeterImage = (event) => {
    const file = event.target.files?.[0];
    if (file) setMeterImage(file);
  };

  const handleFuelSlip = (event) => {
    const file = event.target.files?.[0];
    if (file) setFuelSlip(file);
  };

  /* ------------------------------------------------------------------------ */
  /* Fuel Entries                                                             */
  /* ------------------------------------------------------------------------ */

  const addFuelEntry = () => {
    const litres = Number(fuelLitres);
    const amount = Number(fuelAmount);

    if (
      fuelLitres.trim() === "" ||
      !Number.isFinite(litres) ||
      litres <= 0 ||
      fuelAmount.trim() === "" ||
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      toast.error("Enter valid fuel litres and amount.");
      return;
    }

    setFuelEntries((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        litres,
        totalAmount: amount,
        slip: fuelSlip,
      },
    ]);

    setFuelLitres("");
    setFuelAmount("");
    setFuelSlip(null);
  };

  /* ------------------------------------------------------------------------ */
  /* Complete Destination                                                     */
  /* ------------------------------------------------------------------------ */

  const handleCompleteDestination = async () => {
    if (submitting || !currentDestination) {
      return;
    }

    if (!currentLocation) {
      toast.error("Please capture your current GPS location first.");
      return;
    }

    const destinationLatitude = Number(currentDestination.latitude);
    const destinationLongitude = Number(currentDestination.longitude);

    const driverLatitude = Number(currentLocation.latitude);
    const driverLongitude = Number(currentLocation.longitude);
    const gpsAccuracy = Number(currentLocation.accuracy);

    const hasValidCoordinates =
      [
        destinationLatitude,
        destinationLongitude,
        driverLatitude,
        driverLongitude,
      ].every(Number.isFinite) &&
      Math.abs(destinationLatitude) <= 90 &&
      Math.abs(destinationLongitude) <= 180 &&
      Math.abs(driverLatitude) <= 90 &&
      Math.abs(driverLongitude) <= 180;

    if (!hasValidCoordinates) {
      toast.error(
        "Valid GPS coordinates are required to verify this destination.",
      );
      return;
    }

    if (
      !Number.isFinite(gpsAccuracy) ||
      gpsAccuracy < 0 ||
      gpsAccuracy > MAX_GPS_ACCURACY_METERS
    ) {
      toast.error(
        "GPS accuracy is too low. Move to an area with a better GPS signal and capture your location again.",
      );
      return;
    }

    const distanceMeters = calculateDistanceMeters(
      driverLatitude,
      driverLongitude,
      destinationLatitude,
      destinationLongitude,
    );

    if (distanceMeters > MAX_DESTINATION_DISTANCE_METERS) {
      toast.error(
        `You are approximately ${Math.round(distanceMeters)} m away. You must be within 200 m of the destination.`,
      );
      return;
    }

    if (!Number.isFinite(Number(meterReading)) || meterReading.trim() === "") {
      toast.error("Please enter a valid meter reading.");
      return;
    }

    if (!meterImage) {
      toast.error("Please upload the meter image.");
      return;
    }

    if (!selfie) {
      toast.error("Please take a geo-selfie.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("latitude", String(currentLocation.latitude));
      formData.append("longitude", String(currentLocation.longitude));
      formData.append("accuracy", String(currentLocation.accuracy ?? ""));
      formData.append("meterReading", meterReading);
      formData.append("meterImage", meterImage);
      formData.append("selfie", selfie);

      formData.append(
        "fuelEntries",
        JSON.stringify(fuelEntries.map(({ id, slip, ...entry }) => entry)),
      );

      fuelEntries.forEach((entry, index) => {
        if (entry.slip) {
          formData.append(`fuelSlip_${index}`, entry.slip);
        }
      });

      const updatedTrip = await completeDestination(
        tripId,
        currentDestination._id,
        formData,
      );

      setTrip(updatedTrip);

      setMeterReading("");
      setMeterImage(null);
      setSelfie(null);
      setFuelEntries([]);
      setFuelLitres("");
      setFuelAmount("");
      setFuelSlip(null);

      toast.success("Destination completed successfully.");
    } catch (error) {
      console.error("Complete destination failed:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to complete destination.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Complete Trip                                                            */
  /* ------------------------------------------------------------------------ */

  const handleCompleteTrip = async () => {
    if (submitting || !trip) {
      return;
    }

    if (!allDestinationsCompleted) {
      toast.error("Complete all destinations before finishing the trip.");
      return;
    }

    if (!currentLocation) {
      toast.error("Current GPS location is required to complete the trip.");
      return;
    }

    try {
      setSubmitting(true);

      const updatedTrip = await completeTrip(tripId, {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        accuracy: currentLocation.accuracy,
        meterReading:
          meterReading.trim() === "" ? undefined : Number(meterReading),
      });

      await stopBackgroundGpsTracking().catch((error) => {
        console.error("Unable to stop background GPS:", error);
      });

      setTrip(updatedTrip);

      toast.success("Trip completed successfully.");
      navigate("/trip");

      setTrip(updatedTrip);

      toast.success("Trip completed successfully.");
      navigate("/trip");
    } catch (error) {
      console.error("Complete trip failed:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to complete trip.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Render States                                                            */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-sm font-medium text-gray-500">Loading trip...</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <MdWarning size={40} className="text-gray-300" />
        <p className="mt-3 text-sm text-gray-500">
          {tripId ? "Trip not found." : "Trip ID is missing."}
        </p>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* UI                                                                       */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="mx-auto w-full max-w-5xl pb-6">
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/trip")}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <MdArrowBack size={19} />
          Trip
        </button>

        {trip.status?.toLowerCase() === "ready" ? (
          <button
            type="button"
            disabled={startingTrip}
            onClick={handleStart}
            className="my-3 rounded-2xl bg-[#1f225f] px-5 py-2 text-center text-xl font-medium text-white shadow shadow-black/50 transition hover:bg-[#171a4d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {startingTrip ? "Starting..." : "Start"}
          </button>
        ) : (
          <p className="text-sm font-semibold text-gray-600">{trip.status}</p>
        )}
      </div>

      {/* MAP */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
      >
        <div className="relative h-[320px] bg-gray-100">
          <GoogleMapProvider>
            <TripMap
              driver={trip.driver?.name || "Driver"}
              currentLocation={mapCurrentLocation}
              destinations={destinations}
              route={routeCoordinates}
              activeDestinationId={
                trip.destinations?.find(
                  (destination) => destination.status === "CURRENT",
                )?._id
              }
              height="320px"
            />
          </GoogleMapProvider>

          <button
            type="button"
            onClick={captureLocation}
            disabled={locationLoading}
            aria-label="Capture current location"
            className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1f225f] shadow-lg disabled:opacity-50"
          >
            <MdMyLocation size={21} />
          </button>

          {currentDestination && (
            <div className="absolute bottom-4 left-4 max-w-[75%] rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Current Destination
              </p>

              <p className="mt-1 text-sm font-bold text-gray-900">
                {currentDestination.name}
              </p>
            </div>
          )}
        </div>
      </motion.section>

      {/* GPS STATUS */}
      {gpsError && (
        <div className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800">
          {gpsError}
        </div>
      )}

      {/* PROGRESS */}
      <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Trip Progress</p>
            <p className="mt-1 text-sm font-bold text-gray-900">
              {completedCount} of {destinationCount} destinations
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f225f]/10 text-[#1f225f]">
            <FaRoute size={17} />
          </div>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${
                destinationCount ? (completedCount / destinationCount) * 100 : 0
              }%`,
            }}
            className="h-full rounded-full bg-[#1f225f]"
          />
        </div>
      </div>

      {/* CURRENT DESTINATION */}
      {!allDestinationsCompleted && currentDestination && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <FaMapMarkerAlt size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Destination {currentDestination.sequence}
              </p>

              <h2 className="mt-1 text-lg font-bold text-gray-900">
                {currentDestination.name}
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {currentDestination.address}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={captureLocation}
            disabled={locationLoading}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#1f225f] text-sm font-semibold text-white transition hover:bg-[#171a4d] disabled:opacity-50"
          >
            <MdNavigation size={19} />
            {locationLoading
              ? "Checking Location..."
              : "I'm At This Destination"}
          </button>

          {currentLocation && (
            <div className="mt-3 rounded-2xl bg-green-50 px-4 py-3 text-xs text-green-700">
              <div className="flex items-center gap-2">
                <MdCheck size={18} />
                <span className="font-semibold">GPS location captured</span>
              </div>

              <p className="mt-1">
                Accuracy:{" "}
                {Number.isFinite(currentLocation.accuracy)
                  ? `${Math.round(currentLocation.accuracy)} metres`
                  : "Unknown"}
              </p>
            </div>
          )}
        </motion.section>
      )}

      {/* DESTINATION VERIFICATION FORM */}
      {!allDestinationsCompleted && currentDestination && currentLocation && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Destination Verification
            </p>

            <h2 className="mt-1 text-lg font-bold text-gray-900">
              Complete Stop
            </h2>
          </div>

          {/* SELFIE */}
          <EvidenceCard
            icon={<MdCameraAlt size={21} />}
            title="Geo Selfie"
            description="Take a selfie at the destination."
          >
            <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600">
              <MdCameraAlt size={18} />
              <span className="max-w-[80%] truncate">
                {selfie ? selfie.name : "Take Selfie"}
              </span>

              <input
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleSelfie}
                className="hidden"
              />
            </label>
          </EvidenceCard>

          {/* METER */}
          <EvidenceCard
            icon={<MdOutlineSpeed size={21} />}
            title="Meter Reading"
            description="Enter and photograph the meter."
          >
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                type="number"
                min="0"
                step="any"
                value={meterReading}
                onChange={(event) => setMeterReading(event.target.value)}
                placeholder="Meter reading"
                className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-[#1f225f]"
              />

              <label className="flex h-11 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50 px-3 text-xs font-semibold text-gray-600">
                <span className="truncate">
                  {meterImage ? meterImage.name : "Meter Image"}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleMeterImage}
                  className="hidden"
                />
              </label>
            </div>
          </EvidenceCard>

          {/* FUEL */}
          <EvidenceCard
            icon={<MdLocalGasStation size={21} />}
            title="Fuel"
            description="Add fuel purchase details if applicable."
          >
            <div className="grid gap-2 sm:grid-cols-3">
              <input
                type="number"
                min="0"
                step="0.01"
                value={fuelLitres}
                onChange={(event) => setFuelLitres(event.target.value)}
                placeholder="Litres"
                className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-[#1f225f]"
              />

              <input
                type="number"
                min="0"
                step="0.01"
                value={fuelAmount}
                onChange={(event) => setFuelAmount(event.target.value)}
                placeholder="Amount ₹"
                className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-[#1f225f]"
              />

              <label className="flex h-11 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50 px-3 text-xs font-semibold text-gray-600">
                <span className="truncate">
                  {fuelSlip ? fuelSlip.name : "Fuel Slip"}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFuelSlip}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={addFuelEntry}
              className="mt-3 h-10 rounded-xl bg-gray-100 px-4 text-xs font-semibold text-gray-700 transition hover:bg-gray-200"
            >
              Add Fuel Entry
            </button>

            {fuelEntries.length > 0 && (
              <div className="mt-3 space-y-2">
                {fuelEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2"
                  >
                    <div>
                      <span className="text-xs font-medium text-gray-700">
                        {entry.litres} L
                      </span>

                      {entry.slip && (
                        <p className="max-w-[180px] truncate text-[10px] text-gray-400">
                          {entry.slip.name}
                        </p>
                      )}
                    </div>

                    <span className="text-xs font-semibold text-gray-800">
                      ₹{entry.totalAmount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </EvidenceCard>

          <button
            type="button"
            disabled={submitting}
            onClick={handleCompleteDestination}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#1f225f] text-sm font-bold text-white transition hover:bg-[#171a4d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Complete Destination"}
          </button>
        </motion.section>
      )}

      {/* COMPLETE TRIP */}
      {allDestinationsCompleted && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm"
        >
          <h2 className="text-lg font-bold text-gray-900">
            All Destinations Visited
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            You've completed all route stops. Click below to finish the entire
            trip.
          </p>

          <button
            type="button"
            disabled={submitting}
            onClick={handleCompleteTrip}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-green-600 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Finishing..." : "Complete Entire Trip"}
          </button>
        </motion.section>
      )}
    </div>
  );
};

export default ActiveTrip;
