import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MdBlock,
  MdCalendarToday,
  MdCheckCircleOutline,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
  MdLocalShipping,
  MdLocationOn,
  MdPlayArrow,
  MdRefresh,
  MdSearch,
  MdTimeline,
} from "react-icons/md";

import {
  getAdminTripById,
  getAdminTripGpsTrail,
  getAdminTripSummary,
  getAdminTrips,
} from "../../../services/trip.service.js";

import TripMap from "../../../components/trip/map/TripMap";
import GoogleMapProvider from "../../../components/trip/map/GoogleMapProvider";

const PAGE_SIZE = 10;

const STATUS_STYLES = {
  IN_PROGRESS: "bg-emerald-100 text-emerald-700",
  COMPLETED: "bg-violet-100 text-violet-700",
  CANCELLED: "bg-rose-100 text-rose-700",
  READY: "bg-sky-100 text-sky-700",
  DRAFT: "bg-slate-100 text-slate-600",
};

const formatDate = (value) => {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));
};

const getDriverName = (trip) =>
  trip?.driver?.name ?? trip?.driverName ?? "Driver";

const getVehicleNumber = (trip) =>
  trip?.vehicle?.vehicleNumber ?? trip?.vehicleNumber ?? "Vehicle";

const getTripId = (trip) =>
  trip?.tripNumber ?? trip?.tripCode ?? trip?._id ?? "Trip";

const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
);

const StatsCard = ({ title, value, note, icon: Icon, tone }) => (
  <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-white p-2 shadow-sm">
    <div
      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${tone}`}
    >
      <Icon className="text-base" />
    </div>

    <div className="min-w-0">
      <p className="text-[10px] leading-tight text-slate-500">{title}</p>

      <p className="text-lg font-bold leading-tight text-slate-900">
        {value ?? <Skeleton className="mt-1 h-5 w-10" />}
      </p>

      <p className="text-[9px] leading-tight text-slate-400">{note}</p>
    </div>
  </div>
);

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [summary, setSummary] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [gpsTrail, setGpsTrail] = useState([]);
  const [activeTab, setActiveTab] = useState("Overview");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTrips, setTotalTrips] = useState(0);

  const [loadingTrips, setLoadingTrips] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoadingTrips(true);
      setError("");

      try {
        const [listResult, summaryResult] = await Promise.all([
          getAdminTrips({
            page,
            limit: PAGE_SIZE,
            ...(status ? { status } : {}),
          }),
          getAdminTripSummary(),
        ]);

        if (!active) return;

        // Supports either a paginated object or a bare array response.
        const rows = Array.isArray(listResult)
          ? listResult
          : (listResult?.trips ??
            listResult?.items ??
            listResult?.results ??
            []);

        setTrips(rows);
        setTotalTrips(
          listResult?.total ??
            listResult?.totalItems ??
            listResult?.pagination?.total ??
            rows.length,
        );
        setTotalPages(
          listResult?.totalPages ??
            listResult?.pagination?.totalPages ??
            Math.max(
              1,
              Math.ceil(
                (listResult?.total ??
                  listResult?.pagination?.total ??
                  rows.length) / PAGE_SIZE,
              ),
            ),
        );
        setSummary(summaryResult);
      } catch (loadError) {
        if (active) {
          setError(
            loadError?.response?.data?.message ?? "Unable to load trips.",
          );
        }
      } finally {
        if (active) {
          setLoadingTrips(false);
          setLoadingSummary(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [page, status]);

  const visibleTrips = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return trips;

    return trips.filter((trip) =>
      [
        getTripId(trip),
        getDriverName(trip),
        getVehicleNumber(trip),
        trip?.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [search, trips]);

  const selectTrip = async (trip) => {
    setSelectedTrip(trip);
    setActiveTab("Overview");
    setLoadingDetails(true);
    setGpsTrail([]);

    try {
      const [details, trail] = await Promise.all([
        getAdminTripById(trip._id),
        getAdminTripGpsTrail(trip._id),
      ]);

      setSelectedTrip(details ?? trip);

      const points = Array.isArray(trail)
        ? trail
        : (trail?.gpsTrail ?? trail?.points ?? trail?.data?.gpsTrail ?? []);

      setGpsTrail(points);
    } catch {
      // Keep the selected list item visible if details or GPS are unavailable.
      setSelectedTrip(trip);
    } finally {
      setLoadingDetails(false);
    }
  };

  console.log(selectedTrip);

  const statusCounts = summary?.byStatus ?? {};
  const activeCount = statusCounts.IN_PROGRESS ?? 0;
  const completedCount = statusCounts.COMPLETED ?? 0;
  const cancelledCount = statusCounts.CANCELLED ?? 0;

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  const latestGpsPoint = gpsTrail[gpsTrail.length - 1];

  const destinations = selectedTrip?.destinations ?? [];

  const mapCurrentLocation = gpsTrail[0];

  const routeCoordinates = gpsTrail
    .filter(
      (point) =>
        Number.isFinite(Number(point.latitude)) &&
        Number.isFinite(Number(point.longitude)),
    )
    .map((point) => [Number(point.latitude), Number(point.longitude)]);

  const activeDestinationId =
    destinations.find((destination) => destination.status === "CURRENT")?._id ??
    destinations.find((destination) => destination.status === "PENDING")?._id ??
    null;

  return (
    <div className="min-h-full bg-slate-50">
      <div className=" flex flex-col md:flex-row lg:justify-between">
        <header className="mb-5">
          <h1 className="text-2xl font-bold text-slate-900">Trips</h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor driver trips, track progress, and view trip details.
          </p>
        </header>

        <section className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-4">
          <StatsCard
            title="Total Trips"
            value={loadingSummary ? null : (summary?.total ?? totalTrips)}
            note="All trips"
            icon={MdLocalShipping}
            tone="bg-blue-50 text-blue-600"
          />
          <StatsCard
            title="Active Trips"
            value={loadingSummary ? null : activeCount}
            note="In progress"
            icon={MdPlayArrow}
            tone="bg-emerald-50 text-emerald-600"
          />
          <StatsCard
            title="Completed Trips"
            value={loadingSummary ? null : completedCount}
            note="Completed"
            icon={MdCheckCircleOutline}
            tone="bg-violet-50 text-violet-600"
          />
          <StatsCard
            title="Cancelled Trips"
            value={loadingSummary ? null : cancelledCount}
            note="Cancelled"
            icon={MdBlock}
            tone="bg-rose-50 text-rose-600"
          />
        </section>
      </div>

      <section className="grid min-h-170 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)]">
        <div className="flex min-w-0 flex-col rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900">All Trips</h2>
              <button
                type="button"
                onClick={() => setPage(1)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1f225f] px-4 py-2 text-sm font-semibold text-white hover:bg-[#17194b]"
              >
                <MdRefresh className="text-lg" />
                Refresh
              </button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:border-blue-400">
                <MdSearch className="shrink-0 text-xl text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search driver, vehicle, or trip ID..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </label>

              <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5">
                <MdCalendarToday className="text-lg text-slate-400" />
                <select
                  value={status}
                  onChange={(event) => {
                    setPage(1);
                    setStatus(event.target.value);
                  }}
                  className="min-w-32 bg-transparent text-sm text-slate-600 outline-none"
                >
                  <option value="">All Status</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="READY">Ready</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </label>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">S.NO.</th>
                  <th className="px-4 py-3 font-semibold">Driver</th>
                  <th className="px-4 py-3 font-semibold">Vehicle</th>
                  <th className="px-4 py-3 font-semibold">Travel Date</th>
                  <th className="px-4 py-3 font-semibold">DESTINATIONS</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Distance</th>
                  <th className="px-2 py-3" />
                </tr>
              </thead>

              <tbody>
                {loadingTrips
                  ? Array.from({ length: 7 }).map((_, index) => (
                      <tr key={index} className="border-t border-slate-100">
                        {Array.from({ length: 7 }).map((__, cell) => (
                          <td key={cell} className="px-4 py-4">
                            <Skeleton className="h-4 w-20" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : visibleTrips.map((trip, index) => (
                      <tr
                        key={trip._id}
                        onClick={() => selectTrip(trip)}
                        className={`cursor-pointer border-t border-slate-100 transition hover:bg-blue-50 ${
                          selectedTrip?._id === trip._id ? "bg-blue-50" : ""
                        }`}
                      >
                        <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                          {index + 1}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {getDriverName(trip)}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {getVehicleNumber(trip)}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {formatDate(trip.travelDate ?? trip.createdAt)}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {`${trip.startLocation.name} -> ${trip.destinations[trip.destinations.length - 1].name}`}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ${
                              STATUS_STYLES[trip.status] ??
                              "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {String(trip.status ?? "UNKNOWN").replaceAll(
                              "_",
                              " ",
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {trip.destinations.reduce(
                            (sum, d) =>
                              sum +
                              (Number(
                                d.arrival?.distanceFromDestinationMeters,
                              ) / 1000 || 0),
                            0,
                          )}{" "}
                          Km
                        </td>
                        <td className="px-2 py-4 text-slate-400">
                          <MdChevronRight className="text-xl" />
                        </td>
                      </tr>
                    ))}

                {!loadingTrips && visibleTrips.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-sm text-slate-500"
                    >
                      {error || "No trips match your search."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <footer className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-500">
            <span>
              Showing {visibleTrips.length ? (page - 1) * PAGE_SIZE + 1 : 0}–
              {(page - 1) * PAGE_SIZE + visibleTrips.length} of {totalTrips}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1 || loadingTrips}
                className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
                aria-label="Previous page"
              >
                <MdChevronLeft />
              </button>
              <span className="min-w-8 text-center font-semibold text-slate-800">
                {page}
              </span>
              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages || loadingTrips}
                className="rounded-lg border border-slate-200 p-2 disabled:opacity-40"
                aria-label="Next page"
              >
                <MdChevronRight />
              </button>
            </div>
          </footer>
        </div>

        <motion.aside
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
        >
          {selectedTrip ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">
                      {getTripId(selectedTrip)}
                    </h2>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        STATUS_STYLES[selectedTrip.status] ??
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {String(selectedTrip.status ?? "UNKNOWN").replaceAll(
                        "_",
                        " ",
                      )}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {getDriverName(selectedTrip)} ·{" "}
                    {getVehicleNumber(selectedTrip)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTrip(null);
                    setGpsTrail([]);
                  }}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                  aria-label="Close trip details"
                >
                  <MdClose className="text-xl" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 border-b border-slate-100 pb-4 text-xs">
                <div>
                  <p className="text-slate-400">Travel date</p>
                  <p className="mt-1 font-semibold text-slate-700">
                    {formatDate(
                      selectedTrip.travelDate ?? selectedTrip.createdAt,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Distance</p>
                  <p className="mt-1 font-semibold text-slate-700">
                    {selectedTrip.destinations.reduce(
                      (sum, d) =>
                        sum +
                        (Number(d.arrival?.distanceFromDestinationMeters) /
                          1000 || 0),
                      0,
                    )}{" "}
                    Kms
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Stops</p>
                  <p className="mt-1 font-semibold text-slate-700">
                    {selectedTrip.destinations?.length ?? 0}
                  </p>
                </div>
              </div>

              <nav className="mt-2 flex gap-4 overflow-x-auto border-b border-slate-100">
                {[
                  "Overview",
                  "Destinations",
                  "Audit Log",
                  "Meter Reading",
                  "Fuel Entry",
                ].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap border-b-2 px-1 py-3 text-sm ${
                      activeTab === tab
                        ? "border-[#1f225f] font-semibold text-[#1f225f]"
                        : "border-transparent text-slate-500"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>

              <div className="pt-4">
                {loadingDetails ? (
                  <div className="space-y-3">
                    <Skeleton className="h-52 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : activeTab === "Destinations" ? (
                  <div className="space-y-3">
                    {(selectedTrip.destinations ?? []).map(
                      (destination, index) => (
                        <div
                          key={destination._id ?? index}
                          className="flex gap-3 rounded-xl border border-slate-100 p-3"
                        >
                          <MdLocationOn className="mt-0.5 text-xl text-[#1f225f]" />
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {destination.name ?? `Stop ${index + 1}`}
                            </p>
                            <p className="text-xs text-slate-500">
                              {destination.address ?? "Address unavailable"}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {destination.status ?? "PENDING"}
                            </p>
                          </div>
                        </div>
                      ),
                    )}
                    {!selectedTrip.destinations?.length && (
                      <p className="text-sm text-slate-500">
                        No destinations available.
                      </p>
                    )}
                  </div>
                ) : activeTab === "GPS Trail" ? (
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <MdTimeline className="text-lg text-blue-600" />
                      GPS trail points
                      <span className="font-normal text-slate-500">
                        ({gpsTrail.length})
                      </span>
                    </div>
                    <div className="max-h-96 space-y-2 overflow-y-auto">
                      {gpsTrail
                        .slice()
                        .reverse()
                        .map((point, index) => (
                          <div
                            key={`${point.createdAt ?? "point"}-${index}`}
                            className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600"
                          >
                            <p className="font-semibold">Point {index + 1}</p>
                            <p>
                              {point.latitude}, {point.longitude}
                            </p>
                            <p className="text-slate-400">
                              {formatDate(point.createdAt)}
                            </p>
                          </div>
                        ))}
                      {!gpsTrail.length && (
                        <p className="text-sm text-slate-500">
                          No GPS points recorded.
                        </p>
                      )}
                    </div>
                  </div>
                ) : activeTab === "Audit Log" ? (
                  <div className="space-y-3">
                    {(selectedTrip.auditLog ?? []).map((entry, index) => (
                      <div
                        key={entry._id ?? index}
                        className="rounded-xl bg-slate-50 p-3"
                      >
                        <p className="text-sm font-semibold text-slate-800">
                          {entry.action}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {formatDate(entry.createdAt)} ·{" "}
                          {entry.role ?? "System"}
                        </p>
                      </div>
                    ))}
                    {!selectedTrip.auditLog?.length && (
                      <p className="text-sm text-slate-500">
                        No audit entries available.
                      </p>
                    )}
                  </div>
                ) : activeTab === "Meter Reading" ? (
                  <div className="space-y-3">
                    {/* Start Meter */}
                    {selectedTrip.startMeter && (
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-sm font-semibold text-slate-800">
                          Trip Start Meter
                        </p>

                        <p className="mt-1 text-sm text-slate-600">
                          Reading: {selectedTrip.startMeter.reading ?? "N/A"}
                        </p>

                        {selectedTrip.startMeter.imageUrl && (
                          <a
                            href={`https://esf.axeiro.com/uploads/trips/start/${selectedTrip.startMeter.imageUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                          >
                            View Meter Image
                          </a>
                        )}
                      </div>
                    )}

                    {/* Destination Meter Readings */}
                    {(selectedTrip.destinations ?? []).map(
                      (destination, index) => {
                        const meter =
                          destination.meterReading ??
                          destination.arrival?.meterReading;

                        if (!meter && !destination.meterImageUrl) return null;

                        return (
                          <div
                            key={destination._id ?? index}
                            className="rounded-xl bg-slate-50 p-3"
                          >
                            <p className="text-sm font-semibold text-slate-800">
                              {destination.name ?? `Destination ${index + 1}`}
                            </p>

                            {meter?.reading != null && (
                              <p className="mt-1 text-sm text-slate-600">
                                Reading: {meter.reading}
                              </p>
                            )}

                            {(meter?.imageUrl ?? destination.meterImageUrl) && (
                              <a
                                href={`https://esf.axeiro.com${meter?.imageUrl ?? destination.meterImageUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                              >
                                View Meter Image
                              </a>
                            )}
                          </div>
                        );
                      },
                    )}

                    {/* Empty State */}
                    {!selectedTrip.startMeter &&
                      !(selectedTrip.destinations ?? []).some(
                        (destination) =>
                          destination.meterReading ||
                          destination.arrival?.meterReading ||
                          destination.meterImageUrl,
                      ) && (
                        <p className="text-sm text-slate-500">
                          No Meter Reading entries available.
                        </p>
                      )}
                  </div>
                ) : activeTab === "Fuel Entry" ? (
                  <div className="space-y-3">
                    {(selectedTrip.destinations ?? []).flatMap((destination) =>
                      (destination.fuelEntries ?? []).map((fuel, index) => (
                        <div
                          key={fuel._id ?? `${destination._id}-${index}`}
                          className="rounded-xl bg-slate-50 p-3"
                        >
                          <p className="text-sm font-semibold text-slate-800">
                            {destination.name} — {fuel.litres} Litres
                          </p>

                          <p className="mt-1 text-sm text-slate-600">
                            Total Amount: ₹
                            {Number(fuel.totalAmount ?? 0).toLocaleString(
                              "en-IN",
                            )}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {fuel.capturedAt
                              ? formatDate(fuel.capturedAt)
                              : "Date unavailable"}
                          </p>

                          {fuel.slipImageUrl && (
                            <a
                              href={`https://esfserver.axeiro.com${fuel.slipImageUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                            >
                              View Fuel Slip
                            </a>
                          )}
                        </div>
                      )),
                    )}

                    {!(selectedTrip.destinations ?? []).some(
                      (destination) => destination.fuelEntries?.length,
                    ) && (
                      <p className="text-sm text-slate-500">
                        No fuel entries available.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <h3 className="mb-3 font-semibold text-slate-800">
                        Trip Overview
                      </h3>
                      <p className="text-sm text-slate-600">
                        Driver: {getDriverName(selectedTrip)}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Vehicle: {getVehicleNumber(selectedTrip)}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Destinations: {selectedTrip.destinations?.length ?? 0}
                      </p>
                    </div>

                    <div className="grid min-h-48 place-items-center rounded-xl border border-slate-100 bg-slate-50 p-5 text-center">
                      <div className="h-80 w-full overflow-hidden rounded-xl">
                        <GoogleMapProvider>
                          <TripMap
                            driver={selectedTrip.driver?.name || "Driver"}
                            currentLocation={mapCurrentLocation}
                            destinations={destinations}
                            route={routeCoordinates}
                            activeDestinationId={activeDestinationId}
                            height="320px"
                          />
                        </GoogleMapProvider>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-100 p-4">
                      <div className="mb-2 flex items-center gap-2 font-semibold text-slate-800">
                        <MdTimeline className="text-lg text-blue-600" />
                        Trip progress
                      </div>
                      <p className="text-sm text-slate-500">
                        {
                          (selectedTrip.destinations ?? []).filter(
                            (destination) => destination.status === "COMPLETED",
                          ).length
                        }{" "}
                        of {selectedTrip.destinations?.length ?? 0} destinations
                        completed
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="grid min-h-[400px] place-items-center text-center">
              <div>
                <MdLocalShipping className="mx-auto mb-3 text-4xl text-slate-300" />
                <p className="font-semibold text-slate-700">Select a trip</p>
                <p className="mt-1 text-sm text-slate-500">
                  Trip details will appear here.
                </p>
              </div>
            </div>
          )}
        </motion.aside>
      </section>
    </div>
  );
};

export default Trips;
