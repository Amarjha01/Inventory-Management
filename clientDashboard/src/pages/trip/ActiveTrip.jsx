import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdCheck,
  MdLocationOn,
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
} from "../../services/trip.service";

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

  const [meterReading, setMeterReading] = useState("");
  const [selfie, setSelfie] = useState(null);
  const [meterImage, setMeterImage] = useState(null);

  const [fuelEntries, setFuelEntries] = useState([]);
  const [fuelLitres, setFuelLitres] = useState("");
  const [fuelAmount, setFuelAmount] = useState("");
  const [fuelSlip, setFuelSlip] = useState(null);

  const [submitting, setSubmitting] = useState(false);

  /* Load trip data */
  useEffect(() => {
    if (!tripId) return;

    const loadTrip = async () => {
      try {
        setLoading(true);
        const response = await getTripById(tripId);
        setTrip(response);
      } catch (error) {
        console.error("getTripById failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [tripId]);

  /* Current destination memo */
  const currentDestination = useMemo(() => {
    if (!trip?.destinations) return null;

    return (
      trip.destinations.find(
        (destination) => destination.status === "CURRENT",
      ) ||
      trip.destinations.find((destination) => destination.status === "PENDING")
    );
  }, [trip]);

  /* GPS Capture */
  const captureLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        setCurrentLocation(location);

        try {
          // FIXED: replaced 'id' with 'tripId'
          await updateTripLocation(tripId, location);
        } catch (error) {
          console.error("Location update error:", error);
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error(error);
        setLocationLoading(false);
        alert("Unable to get your current location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  /* File Handlers */
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

  /* Fuel logic */
  const addFuelEntry = () => {
    if (
      !fuelLitres ||
      Number(fuelLitres) <= 0 ||
      !fuelAmount ||
      Number(fuelAmount) < 0
    ) {
      return;
    }

    setFuelEntries((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        litres: Number(fuelLitres),
        totalAmount: Number(fuelAmount),
        slip: fuelSlip,
      },
    ]);

    setFuelLitres("");
    setFuelAmount("");
    setFuelSlip(null);
  };

  /* Complete Destination Handler */
  const handleCompleteDestination = async () => {
    if (!currentDestination) return;

    if (!currentLocation) {
      alert("Please capture your current GPS location first.");
      return;
    }

    if (!meterReading) {
      alert("Please enter the meter reading.");
      return;
    }

    if (!meterImage) {
      alert("Please upload the meter image.");
      return;
    }

    if (!selfie) {
      alert("Please take a geo-selfie.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("latitude", currentLocation.latitude);
      formData.append("longitude", currentLocation.longitude);
      formData.append("accuracy", currentLocation.accuracy);
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

      // FIXED: replaced 'id' with 'tripId'
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

      alert("Destination completed successfully.");
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message || "Unable to complete destination.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* Complete Trip Handler */
  const handleCompleteTrip = async () => {
    if (!trip) return;

    try {
      setSubmitting(true);

      // FIXED: replaced 'id' with 'tripId'
      const updatedTrip = await completeTrip(tripId, {
        latitude: currentLocation?.latitude,
        longitude: currentLocation?.longitude,
        meterReading,
      });

      setTrip(updatedTrip);
      navigate("/trip");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Unable to complete trip.");
    } finally {
      setSubmitting(false);
    }
  };

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
        <p className="mt-3 text-sm text-gray-500">Trip not found.</p>
      </div>
    );
  }

  const completedCount =
    trip.destinations?.filter(
      (destination) => destination.status === "COMPLETED",
    ).length || 0;

  const destinationCount = trip.destinations?.length || 0;

  const allDestinationsCompleted =
    destinationCount > 0 && completedCount === destinationCount;

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

        <div className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
          In Progress
        </div>
      </div>

      {/* MAP */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm"
      >
        <div className="relative h-[320px] bg-gray-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <FaRoute className="mx-auto text-gray-300" size={40} />
              <p className="mt-2 text-sm font-semibold text-gray-500">
                Live Route Map
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Map component will be connected here.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={captureLocation}
            disabled={locationLoading}
            className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1f225f] shadow-lg disabled:opacity-50"
          >
            <MdMyLocation size={21} />
          </button>

          {currentDestination && (
            <div className="absolute left-4 top-4 max-w-[75%] rounded-2xl bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
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
                destinationCount
                  ? (completedCount / destinationCount) * 100
                  : 0
              }%`,
            }}
            className="h-full rounded-full bg-[#1f225f]"
          />
        </div>
      </div>

      {/* CURRENT DESTINATION HEADER & LOCATION */}
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
              {selfie ? selfie.name : "Take Selfie"}
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
                value={meterReading}
                onChange={(event) => setMeterReading(event.target.value)}
                placeholder="Meter reading"
                className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none"
              />

              <label className="flex h-11 cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-xs font-semibold text-gray-600">
                {meterImage ? meterImage.name : "Meter Image"}
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
                className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none"
              />

              <input
                type="number"
                min="0"
                step="0.01"
                value={fuelAmount}
                onChange={(event) => setFuelAmount(event.target.value)}
                placeholder="Amount ₹"
                className="h-11 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none"
              />

              <label className="flex h-11 cursor-pointer items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-xs font-semibold text-gray-600">
                {fuelSlip ? fuelSlip.name : "Fuel Slip"}
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
              className="mt-3 h-10 rounded-xl bg-gray-100 px-4 text-xs font-semibold text-gray-700"
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
                    <span className="text-xs font-medium text-gray-700">
                      {entry.litres} L
                    </span>
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
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#1f225f] text-sm font-bold text-white transition hover:bg-[#171a4d] disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Complete Destination"}
          </button>
        </motion.section>
      )}

      {/* COMPLETE TRIP ACTION */}
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
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-green-600 text-sm font-bold text-white transition hover:bg-green-700 disabled:opacity-50"
          >
            {submitting ? "Finishing..." : "Complete Entire Trip"}
          </button>
        </motion.section>
      )}
    </div>
  );
};

export default ActiveTrip;