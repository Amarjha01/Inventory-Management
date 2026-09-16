import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdArrowBack,
  MdCalendarToday,
  MdChevronRight,
  MdLocationOn,
  MdSearch,
  MdSpeed,
} from "react-icons/md";
import { FaRoute, FaTruckMoving } from "react-icons/fa";
import { Link } from "react-router-dom";

import { getDriverTrips, getTrips } from "../../services/trip.service";

const TripHistory = () => {
  const [trips, setTrips] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");

  /*
    |--------------------------------------------------------------------------
    | Load trips
    |--------------------------------------------------------------------------
    */

useEffect(() => {
  const loadTrips = async () => {
    try {
      setLoading(true);

      const response = await getTrips();

      console.log("getTrips response:", response);

      const items = response?.items ?? [];
      console.log("items", items);
      
      setTrips(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error("Failed to load trips:", error);

      setTrips([]);

      alert(
        error?.response?.data?.message || "Unable to load trip history."
      );
    } finally {
      setLoading(false);
    }
  };

  loadTrips();
}, []);

  /*
    |--------------------------------------------------------------------------
    | Filter
    |--------------------------------------------------------------------------
    */

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesSearch =
        !search ||
        trip?.startLocation?.address
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        trip?.destinations?.some((destination) =>
          destination?.name?.toLowerCase().includes(search.toLowerCase()),
        );

      const matchesStatus = status === "ALL" || trip?.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [trips, search, status]);

  console.log("filteredTrip" , filteredTrips);
  
  return (
    <div className="mx-auto w-full max-w-4xl pb-6">
      {/* HEADER */}

      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
      >
        <Link
          to="/trip"
          className="
                        mb-4
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-medium
                        text-gray-500
                    "
        >
          <MdArrowBack size={19} />
          Back
        </Link>

        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Driver Portal
        </p>

        <h1 className="mt-1 text-2xl font-bold text-[#1f225f]">Trip History</h1>

        <p className="mt-1 text-sm text-gray-500">
          View your completed and previous journeys.
        </p>
      </motion.div>

      {/* FILTER */}

      <div className="mt-5 space-y-3">
        <div className="relative">
          <MdSearch
            className="
                            absolute
                            left-3
                            top-1/2
                            -translate-y-1/2
                            text-gray-400
                        "
            size={20}
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search trips or destinations"
            className="
                            h-12
                            w-full
                            rounded-2xl
                            border
                            border-gray-200
                            bg-white
                            pl-10
                            pr-4
                            text-sm
                            outline-none
                            shadow-sm
                            focus:border-[#1f225f]
                        "
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            {
              label: "All",
              value: "ALL",
            },
            {
              label: "Completed",
              value: "COMPLETED",
            },
            {
              label: "Cancelled",
              value: "CANCELLED",
            },
          ].map((item) => {
            const active = status === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setStatus(item.value)}
                className={`
                                    shrink-0
                                    rounded-full
                                    px-4
                                    py-2
                                    text-xs
                                    font-semibold
                                    transition

                                    ${
                                      active
                                        ? "bg-[#1f225f] text-white"
                                        : "bg-white text-gray-500 border border-gray-200"
                                    }
                                `}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENT */}

      <div className="mt-5">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="
                                    h-36
                                    animate-pulse
                                    rounded-3xl
                                    bg-gray-100
                                "
              />
            ))}
          </div>
        ) : filteredTrips.length === 0 ? (
          <EmptyHistory />
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredTrips.map((trip, index) => (
                <TripHistoryCard key={trip._id || index} trip={trip} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

const TripHistoryCard = ({ trip }) => {
  const destinations = trip?.destinations || [];

  const completedDestinations = destinations.filter(
    (destination) => destination.status === "COMPLETED",
  ).length;

  const date = trip?.completedAt
    ? new Date(trip.completedAt)
    : trip?.createdAt
      ? new Date(trip.createdAt)
      : null;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        y: -2,
      }}
      transition={{
        duration: 0.2,
      }}
      className="
                overflow-hidden
                rounded-3xl
                border
                border-gray-100
                bg-white
                shadow-sm
            "
    >
      <div className="p-4">
        {/* TOP */}

        <div className="flex items-start gap-3">
          <div
            className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-[#1f225f]/10
                            text-[#1f225f]
                        "
          >
            <FaRoute size={18} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Trip #{trip?._id?.slice(-6)?.toUpperCase() || "N/A"}
                </p>

                <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
                  <MdCalendarToday size={13} />

                  {date
                    ? date.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "Unknown date"}
                </div>
              </div>

              <StatusBadge status={trip?.status} />
            </div>
          </div>
        </div>

        {/* ROUTE */}

        <div
          className="
                        mt-4
                        rounded-2xl
                        bg-gray-50
                        p-3
                    "
        >
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className="h-2.5 w-2.5 rounded-full bg-[#1f225f]" />

              <div className="h-8 w-px border-l border-dashed border-gray-300" />

              <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
            </div>

            <div className="min-w-0 flex-1">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Start
                </p>

                <p className="truncate text-xs font-semibold text-gray-700">
                  {trip?.startLocation?.address || "Starting location"}
                </p>
              </div>

              <div className="mt-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Destinations
                </p>

                <p className="truncate text-xs font-semibold text-gray-700">
                  {destinations
                    .map((destination) => destination.name)
                    .join(" → ") || "No destinations"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* STATS */}

        <div className="mt-3 grid grid-cols-3 gap-2">
          <Stat
            icon={<MdLocationOn size={16} />}
            label="Stops"
            value={destinations.length}
          />

          <Stat
            icon={<MdCheckIcon />}
            label="Completed"
            value={completedDestinations}
          />

          <Stat
            icon={<MdSpeed size={17} />}
            label="Distance"
            value={trip?.totalDistance ? `${trip.totalDistance} km` : "—"}
          />
        </div>

        {/* ACTION */}

        <Link
          to={`/trip/${trip._id}`}
          className="
                        mt-3
                        flex
                        h-10
                        items-center
                        justify-center
                        gap-1
                        rounded-xl
                        bg-gray-50
                        text-xs
                        font-semibold
                        text-gray-600
                        transition
                        hover:bg-[#1f225f]/5
                        hover:text-[#1f225f]
                    "
        >
          View Trip Details
          <MdChevronRight size={18} />
        </Link>
      </div>
    </motion.div>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    COMPLETED: {
      label: "Completed",
      className: "bg-green-50 text-green-700",
    },

    CANCELLED: {
      label: "Cancelled",
      className: "bg-red-50 text-red-700",
    },

    IN_PROGRESS: {
      label: "In Progress",
      className: "bg-blue-50 text-blue-700",
    },

    READY: {
      label: "Ready",
      className: "bg-yellow-50 text-yellow-700",
    },
  };

  const current = config[status] || {
    label: status || "Unknown",
    className: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`
                shrink-0
                rounded-full
                px-2.5
                py-1
                text-[10px]
                font-bold
                ${current.className}
            `}
    >
      {current.label}
    </span>
  );
};

const Stat = ({ icon, label, value }) => {
  return (
    <div
      className="
                rounded-xl
                bg-gray-50
                px-3
                py-2
            "
    >
      <div className="flex items-center gap-1.5 text-gray-400">
        {icon}

        <span className="text-[10px] font-medium">{label}</span>
      </div>

      <p className="mt-1 text-xs font-bold text-gray-800">{value}</p>
    </div>
  );
};

const MdCheckIcon = () => <span className="text-green-500">✓</span>;

const EmptyHistory = () => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
                rounded-3xl
                border
                border-dashed
                border-gray-200
                bg-white
                px-6
                py-12
                text-center
            "
    >
      <div
        className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gray-100
                    text-gray-400
                "
      >
        <FaTruckMoving size={24} />
      </div>

      <h2 className="mt-4 text-sm font-bold text-gray-800">No trips found</h2>

      <p className="mx-auto mt-1 max-w-xs text-xs text-gray-500">
        Your completed trips will appear here.
      </p>
    </motion.div>
  );
};

export default TripHistory;
