import { motion } from "framer-motion";
import {
  MdAddRoad,
  MdLocationOn,
  MdArrowForward,
  MdHistory,
} from "react-icons/md";
import { FaRoute, FaTruckMoving } from "react-icons/fa";
import { Link } from "react-router-dom";

const Trip = () => {
  const activeTrip = null;

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

      {activeTrip ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="
                        overflow-hidden
                        rounded-3xl
                        bg-white
                        border
                        border-gray-100
                        shadow-sm
                    "
        >
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Active Trip
                </p>

                <h2 className="mt-1 text-lg font-bold text-gray-900">
                  Patna → Hajipur
                </h2>
              </div>

              <span
                className="
                                    rounded-full
                                    bg-green-50
                                    px-3
                                    py-1
                                    text-xs
                                    font-semibold
                                    text-green-700
                                "
              >
                In Progress
              </span>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <div
                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-[#1f225f]/10
                                    text-[#1f225f]
                                "
              >
                <MdLocationOn size={22} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Destination 2 of 3
                </p>

                <p className="text-xs text-gray-500">42 km remaining</p>
              </div>
            </div>

            <Link
              to="/trip/active"
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
              Vehicle information
            </p>
          </div>

          <span className="text-xs font-medium text-green-600">Active</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Trip;
