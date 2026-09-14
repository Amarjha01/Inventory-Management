import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdAdd,
  MdArrowBack,
  MdDeleteOutline,
  MdLocationOn,
  MdMyLocation,
  MdOutlineSpeed,
  MdSearch,
  MdSwapVert,
} from "react-icons/md";
import { FaRoute, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { createTrip } from "../../services/trip.service";

const CreateTrip = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [startLocation, setStartLocation] = useState({
    address: "",
    latitude: null,
    longitude: null,
    source: "MANUAL",
    accuracy: null,
  });

  const [locationLoading, setLocationLoading] = useState(false);

  const [meterReading, setMeterReading] = useState("");

  const [meterImage, setMeterImage] = useState(null);

  const [destinationInput, setDestinationInput] = useState("");

  const [destinations, setDestinations] = useState([]);

  /*
    |--------------------------------------------------------------------------
    | Current GPS location
    |--------------------------------------------------------------------------
    */

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        setStartLocation({
          address: `(${latitude.toFixed(5)}, ${longitude.toFixed(5)})`,
          latitude,
          longitude,
          source: "GPS",
          accuracy,
        });

        setLocationLoading(false);
      },
      (error) => {
        console.error(error);

        setLocationLoading(false);

        alert(
          "Unable to get your current location. Please allow location access.",
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  /*
    |--------------------------------------------------------------------------
    | Manual location
    |--------------------------------------------------------------------------
    */

  const handleManualLocation = (value) => {
    setStartLocation((prev) => ({
      ...prev,
      address: value,
      source: "MANUAL",
    }));
  };

  /*
    |--------------------------------------------------------------------------
    | Meter image
    |--------------------------------------------------------------------------
    */

  const handleMeterImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setMeterImage(file);
  };

  /*
    |--------------------------------------------------------------------------
    | Add destination
    |--------------------------------------------------------------------------
    */

  const addDestination = () => {
    const value = destinationInput.trim();

    if (!value) return;

    const destination = {
      id: crypto.randomUUID(),

      sequence: destinations.length + 1,

      name: value,

      address: value,

      latitude: null,

      longitude: null,

      status: "PENDING",
    };

    setDestinations((prev) => [...prev, destination]);

    setDestinationInput("");
  };

  /*
    |--------------------------------------------------------------------------
    | Remove destination
    |--------------------------------------------------------------------------
    */

  const removeDestination = (id) => {
    setDestinations((prev) =>
      prev
        .filter((destination) => destination.id !== id)
        .map((destination, index) => ({
          ...destination,
          sequence: index + 1,
        })),
    );
  };

  /*
    |--------------------------------------------------------------------------
    | Move destination
    |--------------------------------------------------------------------------
    */

  const moveDestination = (index, direction) => {
    const newDestinations = [...destinations];

    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newDestinations.length) {
      return;
    }

    [newDestinations[index], newDestinations[targetIndex]] = [
      newDestinations[targetIndex],
      newDestinations[index],
    ];

    setDestinations(
      newDestinations.map((destination, index) => ({
        ...destination,
        sequence: index + 1,
      })),
    );
  };

  /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

  const canCreateTrip = useMemo(() => {
    return (
      startLocation.address &&
      meterReading &&
      Number(meterReading) >= 0 &&
      meterImage &&
      destinations.length > 0
    );
  }, [startLocation, meterReading, meterImage, destinations]);

  /*
    |--------------------------------------------------------------------------
    | Create trip
    |--------------------------------------------------------------------------
    */

  const handleCreateTrip = async () => {
    if (!canCreateTrip) return;

    try {
      setLoading(true);

      /*
       * NOTE:
       * This assumes the backend accepts JSON for trip creation.
       * The initial meter image should normally be uploaded
       * through the start-trip/evidence endpoint.
       */

      const payload = {
        vehicleId:"6a743c2d3f54294f6e35d48a",
        startLocation,
        startMeter: {
          reading: Number(meterReading),
        },

        destinations: destinations.map(({ id, ...destination }) => destination),
      };

      const trip = await createTrip(payload);

      /*
       * If the backend returns the newly created trip ID,
       * navigate to the trip details/start flow.
       */

      if (trip?._id) {
        navigate(`/trip/${trip._id}`);
      } else {
        navigate("/trip");
      }
    } catch (error) {
      console.error("Create trip error:", error);

      alert(error?.response?.data?.message || "Unable to create trip.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl pb-6">
      {/* HEADER */}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5"
      >
        <button
          type="button"
          onClick={() => navigate("/trip")}
          className="
                        mb-4
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-medium
                        text-gray-500
                        hover:text-gray-800
                    "
        >
          <MdArrowBack size={19} />
          Back
        </button>

        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Trip Management
        </p>

        <h1 className="mt-1 text-2xl font-bold text-[#1f225f]">
          Create New Trip
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Enter your starting point, meter reading and destination stops.
        </p>
      </motion.div>

      <div className="space-y-4">
        {/* START LOCATION */}

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="
                        rounded-3xl
                        border
                        border-gray-100
                        bg-white
                        p-5
                        shadow-sm
                    "
        >
          <SectionHeader
            icon={<MdLocationOn size={21} />}
            title="Starting Location"
            description="Where are you starting the trip?"
          />

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
                value={startLocation.address}
                onChange={(event) => handleManualLocation(event.target.value)}
                placeholder="Type starting location"
                className="
                                    h-12
                                    w-full
                                    rounded-2xl
                                    border
                                    border-gray-200
                                    bg-gray-50
                                    pl-10
                                    pr-4
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-[#1f225f]
                                    focus:bg-white
                                "
              />
            </div>

            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={locationLoading}
              className="
                                flex
                                h-11
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-2xl
                                border
                                border-[#1f225f]/20
                                bg-[#1f225f]/5
                                text-sm
                                font-semibold
                                text-[#1f225f]
                                transition
                                hover:bg-[#1f225f]/10
                                disabled:opacity-50
                            "
            >
              <MdMyLocation size={20} />

              {locationLoading
                ? "Getting location..."
                : "Use Current GPS Location"}
            </button>

            {startLocation.latitude && (
              <div
                className="
                                    rounded-2xl
                                    bg-green-50
                                    px-4
                                    py-3
                                    text-xs
                                    text-green-700
                                "
              >
                <p className="font-semibold">GPS location captured</p>

                <p className="mt-1">
                  {startLocation.latitude.toFixed(6)},{" "}
                  {startLocation.longitude.toFixed(6)}
                  {startLocation.accuracy
                    ? ` • ±${Math.round(startLocation.accuracy)}m`
                    : ""}
                </p>
              </div>
            )}
          </div>
        </motion.section>

        {/* INITIAL METER */}

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="
                        rounded-3xl
                        border
                        border-gray-100
                        bg-white
                        p-5
                        shadow-sm
                    "
        >
          <SectionHeader
            icon={<MdOutlineSpeed size={21} />}
            title="Initial Meter Reading"
            description="Record the vehicle meter before starting."
          />

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-600">
                Meter Reading (km)
              </label>

              <input
                type="number"
                min="0"
                value={meterReading}
                onChange={(event) => setMeterReading(event.target.value)}
                placeholder="e.g. 125430"
                className="
                                    h-12
                                    w-full
                                    rounded-2xl
                                    border
                                    border-gray-200
                                    bg-gray-50
                                    px-4
                                    text-sm
                                    outline-none
                                    focus:border-[#1f225f]
                                    focus:bg-white
                                "
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-600">
                Meter Image
              </label>

              <label
                className="
                                    flex
                                    h-12
                                    cursor-pointer
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    border
                                    border-dashed
                                    border-gray-300
                                    bg-gray-50
                                    text-sm
                                    font-medium
                                    text-gray-600
                                    hover:bg-gray-100
                                "
              >
                {meterImage ? meterImage.name : "Upload meter photo"}

                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleMeterImage}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </motion.section>

        {/* DESTINATIONS */}

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="
                        rounded-3xl
                        border
                        border-gray-100
                        bg-white
                        p-5
                        shadow-sm
                    "
        >
          <SectionHeader
            icon={<FaRoute size={18} />}
            title="Destinations"
            description="Add one or more stops in the order you want to visit them."
          />

          {/* ADD */}

          <div className="mt-5 flex gap-2">
            <input
              value={destinationInput}
              onChange={(event) => setDestinationInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addDestination();
                }
              }}
              
              placeholder="Search or type destination"
              className="h-12 min-w-0 flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm outline-none focus:border-[#1f225f] focus:bg-white"/>

            <button
              type="button"
              onClick={addDestination}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1f225f text-white transition hover:bg-[#171a4d]">
              <MdAdd size={24} />
            </button>
          </div>

          {/* LIST */}

          <div className="mt-4 space-y-2">
            <AnimatePresence initial={false}>
              {destinations.map((destination, index) => (
                <motion.div
                  key={destination.id}
                  initial={{
                    opacity: 0,
                    height: 0,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                  }}
                  className="
                                            overflow-hidden
                                        "
                >
                  <div
                    className="
                                                flex
                                                items-center
                                                gap-3
                                                rounded-2xl
                                                border
                                                border-gray-100
                                                bg-gray-50
                                                p-3
                                            "
                  >
                    <div
                      className="
                                                    flex
                                                    h-9
                                                    w-9
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    bg-[#1f225f]
                                                    text-xs
                                                    font-bold
                                                    text-white
                                                "
                    >
                      {index + 1}
                    </div>

                    <FaMapMarkerAlt className="text-red-500" size={17} />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {destination.name}
                      </p>

                      <p className="text-[11px] text-gray-400">
                        Destination {index + 1}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveDestination(index, "up")}
                        disabled={index === 0}
                        className="
                                                        rounded-lg
                                                        p-2
                                                        text-gray-400
                                                        hover:bg-white
                                                        hover:text-gray-700
                                                        disabled:opacity-30
                                                    "
                      >
                        <MdSwapVert size={19} />
                      </button>

                      <button
                        type="button"
                        onClick={() => removeDestination(destination.id)}
                        className="
                                                        rounded-lg
                                                        p-2
                                                        text-gray-400
                                                        hover:bg-red-50
                                                        hover:text-red-500
                                                    "
                      >
                        <MdDeleteOutline size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {destinations.length === 0 && (
              <div
                className="
                                    rounded-2xl
                                    border
                                    border-dashed
                                    border-gray-200
                                    py-8
                                    text-center
                                "
              >
                <FaRoute
                  className="
                                        mx-auto
                                        text-gray-300
                                    "
                  size={26}
                />

                <p className="mt-2 text-sm font-medium text-gray-500">
                  No destinations added
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Add at least one destination.
                </p>
              </div>
            )}
          </div>
        </motion.section>

        {/* ROUTE PREVIEW */}

        {destinations.length > 0 && (
          <motion.section
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
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
            <div
              className="
                                flex
                                items-center
                                gap-3
                                border-b
                                border-gray-100
                                p-5
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
                <FaRoute size={18} />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Route Preview
                </h3>

                <p className="text-xs text-gray-500">
                  {destinations.length} destination
                  {destinations.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div
              className="
                                flex
                                min-h-55
                                items-center
                                justify-center
                                bg-gray-100
                            "
            >
              <div className="text-center">
                <MdLocationOn className="mx-auto text-gray-300" size={40} />

                <p className="mt-2 text-sm font-semibold text-gray-500">
                  Map will appear here
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Connect your map provider here.
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* CREATE */}

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="button"
          disabled={!canCreateTrip || loading}
          onClick={handleCreateTrip}
          className="
                        flex
                        h-14
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-2xl
                        bg-[#1f225f]
                        text-sm
                        font-bold
                        text-white
                        shadow-sm
                        transition
                        hover:bg-[#171a4d]
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                    "
        >
          <FaRoute size={18} />

          {loading ? "Creating Trip..." : "Create Trip"}
        </motion.button>
      </div>
    </div>
  );
};

const SectionHeader = ({ icon, title, description }) => {
  return (
    <div className="flex items-start gap-3">
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
        {icon}
      </div>

      <div>
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>

        <p className="mt-0.5 text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default CreateTrip;
