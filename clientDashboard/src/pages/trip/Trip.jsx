import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MdAddRoad,
  MdLocationOn,
  MdArrowForward,
  MdHistory,
} from "react-icons/md";
import { FaRoute, FaTruckMoving } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getMyTrips } from "../../services/trip.service";

const Trip = () => {
  const [activeTrip, setActiveTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   const fetchActiveTrip = async () => {
  try {
    const response = await getMyTrips();

    const trips = response?.items || [];

    const active = trips.find(
      (trip) => trip.status === "READY"
    );

    setActiveTrip(active || null);
  } catch (error) {
    console.error("Failed to fetch active trip:", error);
    setActiveTrip(null);
  } finally {
    setLoading(false);
  }
};

    fetchActiveTrip();
  }, []);

  const getDestinationTitle = () => {
    if (!activeTrip?.destinations?.length) {
      return "Active Trip";
    }

    const destinations = activeTrip.destinations;

    return destinations
      .map(
        (destination) =>
          destination.name ||
          destination.address ||
          `Destination ${destination.sequence}`,
      )
      .join(" → ");
  };

  const getCurrentDestination = () => {
    if (!activeTrip?.destinations?.length) {
      return null;
    }

    return (
      activeTrip.destinations.find(
        (destination) => destination.status === "CURRENT",
      ) ||
      activeTrip.destinations.find(
        (destination) => destination.status === "ARRIVED",
      ) ||
      activeTrip.destinations.find(
        (destination) => destination.status !== "COMPLETED",
      )
    );
  };

  const currentDestination = getCurrentDestination();

  const getCompletedDestinationCount = () => {
    return (
      activeTrip?.destinations?.filter(
        (destination) => destination.status === "COMPLETED",
      ).length || 0
    );
  };

  const getRemainingDestinations = () => {
    if (!activeTrip?.destinations) {
      return 0;
    }

    return activeTrip.destinations.filter(
      (destination) => destination.status !== "COMPLETED",
    ).length;
  };

  const getVehicleName = () => {
    if (!activeTrip?.vehicle) {
      return "No vehicle assigned";
    }

    return (
      activeTrip.vehicle.vehicleNumber ||
      activeTrip.vehicle.registrationNumber ||
      activeTrip.vehicle.name ||
      "Assigned Vehicle"
    );
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5">
      {/* HEADER */}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-1"
      >
        <p className="text-sm font-medium text-gray-500">Driver Dashboard</p>

        <h1 className="mt-1 text-2xl font-bold text-[#1f225f]">Your Trips</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your journeys and destination deliveries.
        </p>
      </motion.div>

      {/* ACTIVE TRIP */}

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="animate-pulse">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-gray-200" />

            <div className="mx-auto mt-4 h-5 w-40 rounded bg-gray-200" />

            <div className="mx-auto mt-2 h-4 w-64 rounded bg-gray-100" />

            <div className="mx-auto mt-5 h-12 max-w-sm rounded-2xl bg-gray-200" />
          </div>
        </motion.div>
      ) : activeTrip ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="
            overflow-hidden
            rounded-3xl
            border
            border-gray-100
            bg-white
            shadow-sm
          "
        >
          <div className="p-5">
            {/* Trip Header */}

            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Active Trip
                </p>

                <h2 className="mt-1 truncate text-lg font-bold text-gray-900">
                  {getDestinationTitle()}
                </h2>
              </div>

              <span
                className="
                  shrink-0
                  rounded-full
                  bg-green-50
                  px-3
                  py-1
                  text-xs
                  font-semibold
                  text-green-700
                "
              >
                {activeTrip.status === "READY"
                  ? "Ready"
                  : activeTrip.status === "IN_PROGRESS"
                    ? "In Progress"
                    : activeTrip.status}
              </span>
            </div>

            {/* Current Destination */}

            {currentDestination && (
              <div className="mt-5 flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#1f225f]/10
                    text-[#1f225f]
                  "
                >
                  <MdLocationOn size={22} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800">
                    Destination {currentDestination.sequence}
                    {currentDestination.name
                      ? ` · ${currentDestination.name}`
                      : ""}
                  </p>

                  <p className="truncate text-xs text-gray-500">
                    {currentDestination.address || "Destination location"}
                  </p>
                </div>
              </div>
            )}

            {/* Progress */}

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-medium text-gray-500">
                  Destination Progress
                </p>

                <p className="text-xs font-semibold text-[#1f225f]">
                  {getCompletedDestinationCount()} /{" "}
                  {activeTrip.destinations?.length || 0}
                </p>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-[#1f225f] transition-all"
                  style={{
                    width: `${
                      activeTrip.destinations?.length
                        ? (getCompletedDestinationCount() /
                            activeTrip.destinations.length) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Remaining */}

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <FaRoute className="text-[#1f225f]" size={17} />

                <span className="text-sm font-medium text-gray-700">
                  Destinations remaining
                </span>
              </div>

              <span className="text-sm font-bold text-gray-900">
                {getRemainingDestinations()}
              </span>
            </div>

            {/* Continue */}

            <Link
              to={`/trip/active${activeTrip._id ? `?tripId=${activeTrip._id}` : ""}`}
              className="
                mt-5
                flex
                h-12
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-[#1f225f]
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#171a4d]
              "
            >
              Continue Trip
              <MdArrowForward size={19} />
            </Link>
          </div>
        </motion.div>
      ) : (
        /* NO ACTIVE TRIP */

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            rounded-3xl
            border
            border-gray-100
            bg-white
            p-6
            shadow-sm
          "
        >
          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-[#1f225f]/10
              text-[#1f225f]
            "
          >
            <FaRoute size={28} />
          </div>

          <div className="mt-4 text-center">
            <h2 className="text-lg font-bold text-gray-900">No Active Trip</h2>

            <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
              Start a new trip by selecting your starting location and
              destination.
            </p>
          </div>

          <Link
            to="/trip/create"
            className="
              mx-auto
              mt-5
              flex
              h-12
              max-w-sm
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-[#1f225f]
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#171a4d]
            "
          >
            <MdAddRoad size={20} />
            Start New Trip
          </Link>
        </motion.div>
      )}

      {/* QUICK ACTIONS */}

      <div className="grid grid-cols-2 gap-3">
        <Link to="/trip/create">
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="
              h-full
              rounded-2xl
              border
              border-gray-100
              bg-white
              p-4
              shadow-sm
              transition
              hover:shadow-md
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-blue-50
                text-blue-600
              "
            >
              <MdAddRoad size={21} />
            </div>

            <h3 className="mt-3 text-sm font-bold text-gray-900">New Trip</h3>

            <p className="mt-1 text-xs text-gray-500">Create a new journey</p>
          </motion.div>
        </Link>

        <Link to="/trip/history">
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="
              h-full
              rounded-2xl
              border
              border-gray-100
              bg-white
              p-4
              shadow-sm
              transition
              hover:shadow-md
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-purple-50
                text-purple-600
              "
            >
              <MdHistory size={21} />
            </div>

            <h3 className="mt-3 text-sm font-bold text-gray-900">
              Trip History
            </h3>

            <p className="mt-1 text-xs text-gray-500">View previous trips</p>
          </motion.div>
        </Link>
      </div>

      {/* VEHICLE INFO */}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="
          rounded-2xl
          border
          border-gray-100
          bg-white
          p-4
          shadow-sm
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              bg-gray-100
              text-gray-600
            "
          >
            <FaTruckMoving size={21} />
          </div>

          <div className="flex-1">
            <p className="text-xs text-gray-400">Assigned Vehicle</p>

            <p className="text-sm font-semibold text-gray-800">
              {activeTrip ? getVehicleName() : "Vehicle information"}
            </p>
          </div>

          <span className="text-xs font-medium text-green-600">Active</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Trip;
