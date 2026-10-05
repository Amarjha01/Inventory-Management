import React, { useCallback, useEffect, useMemo, useState } from "react";
import ThemeProvider from "../../../components/shared/ui/ThemeProvider";
import { themes } from "../../../components/shared/ui/Theme";
import PageHeader from "../../../components/shared/ui/PageHeader";
import {
  getAllDG,
  getDailyRuntime,
  getLatestDGSession,
} from "../../../services/dgmonetoring.service";

const DGMonetoring = () => {
  const [dgs, setDgs] = useState([]);
  const [latestSessions, setLatestSessions] = useState({});
  const [dailyRuntime, setDailyRuntime] = useState([]);
  const [selectedDG, setSelectedDG] = useState(null);

  const [loadingDGs, setLoadingDGs] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingRuntime, setLoadingRuntime] = useState(false);

  const [error, setError] = useState("");

  // =========================================================
  // Helpers
  // =========================================================

  const isRunning = useCallback((session) => {
    if (!session) return false;

    const status = String(session.status || "").toUpperCase();

    return status === "RUNNING" || status === "START";
  }, []);

  const formatDateTime = useCallback((date) => {
    if (!date) return "--";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "--";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const getRuntime = useCallback((start, stop = null) => {
    if (!start) return "--";

    const startTime = new Date(start);

    if (Number.isNaN(startTime.getTime())) {
      return "--";
    }

    const endTime = stop ? new Date(stop) : new Date();

    if (Number.isNaN(endTime.getTime())) {
      return "--";
    }

    const diffSeconds = Math.max(
      0,
      Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
    );

    const hours = Math.floor(diffSeconds / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
  }, []);

  const getDGKey = useCallback((dg) => {
    return dg?._id || dg?.id || dg?.DGID;
  }, []);

  // =========================================================
  // Fetch all DGs
  // =========================================================

  const fetchDGs = useCallback(async () => {
    try {
      setLoadingDGs(true);
      setError("");

      const response = await getAllDG();

      const data = Array.isArray(response?.data) ? response.data : [];

      setDgs(data);
    } catch (err) {
      console.error("Failed to fetch DGs:", err);
      setError("Failed to load generators.");
      setDgs([]);
    } finally {
      setLoadingDGs(false);
    }
  }, []);

  // =========================================================
  // Fetch latest session for every DG
  // =========================================================

  const fetchLatestSessions = useCallback(async (dgList) => {
    if (!Array.isArray(dgList) || dgList.length === 0) {
      setLatestSessions({});
      return;
    }

    try {
      setLoadingSessions(true);

      const sessionResults = await Promise.all(
        dgList.map(async (dg) => {
          const dgId = getDGKey(dg);

          if (!dgId) {
            return null;
          }

          try {
            const response = await getLatestDGSession(dgId);

            return {
              dgId,
              session: response?.data || null,
            };
          } catch (err) {
            console.error(
              `Failed to fetch latest session for DG ${dgId}:`,
              err
            );

            return {
              dgId,
              session: null,
            };
          }
        })
      );

      const sessionMap = {};

      sessionResults.forEach((result) => {
        if (!result) return;

        sessionMap[result.dgId] = result.session;
      });

      setLatestSessions(sessionMap);
    } catch (err) {
      console.error("Failed to fetch latest DG sessions:", err);
    } finally {
      setLoadingSessions(false);
    }
  }, [getDGKey]);

  // =========================================================
  // Fetch today's runtime
  // =========================================================

 const fetchDailyRuntime = useCallback(async (DGID) => {
  try {
    setLoadingRuntime(true);
    setDailyRuntime([]);

    const response = await getDailyRuntime(DGID);

    const data = Array.isArray(response?.data)
      ? response.data
      : [];

    setDailyRuntime(data);
  } catch (error) {
    console.error("Failed to fetch daily runtime:", error);
    setDailyRuntime([]);
  } finally {
    setLoadingRuntime(false);
  }
}, []);

const handleViewDG = async (dg) => {
  // Open modal immediately
  setSelectedDG(dg);

  // Start skeleton
  setLoadingRuntime(true);

  // Clear previous DG's runtime
  setDailyRuntime([]);

  // Fetch selected DG's day-wise runtime
  await fetchDailyRuntime(dg.DGID);
};


  // =========================================================
  // Initial DG fetch
  // =========================================================

  useEffect(() => {
    fetchDGs();
  }, [fetchDGs, fetchDailyRuntime]);

  // =========================================================
  // Fetch sessions whenever DG list changes
  // =========================================================

  useEffect(() => {
    if (dgs.length > 0) {
      fetchLatestSessions(dgs);
    }
  }, [dgs, fetchLatestSessions]);

  // =========================================================
  // Statistics
  // =========================================================

  const statistics = useMemo(() => {
    let running = 0;
    let stopped = 0;
    let totalKVA = 0;

    dgs.forEach((dg) => {
      const dgId = getDGKey(dg);
      const session = latestSessions[dgId];

      if (isRunning(session)) {
        running++;

        totalKVA += Number(
          dg?.KVA ??
            dg?.kva ??
            session?.KVA ??
            session?.kva ??
            0
        );
      } else {
        stopped++;
      }
    });

    return {
      total: dgs.length,
      running,
      stopped,
      totalKVA,
    };
  }, [dgs, latestSessions, getDGKey, isRunning]);

  // =========================================================
  // Get runtime record for a DG
  // =========================================================

  const getDGDailyRuntime = useCallback(
    (dg) => {
      if (!Array.isArray(dailyRuntime)) {
        return null;
      }

      const dgId = getDGKey(dg);

      return (
        dailyRuntime.find((item) => {
          const runtimeDGId =
            item?._id ||
            item?.dgId ||
            item?.DGID ||
            item?.DGId ||
            item?.generatorId;

          return String(runtimeDGId) === String(dgId);
        }) || null
      );
    },
    [dailyRuntime, getDGKey]
  );

  // =========================================================
  // Get runtime display
  // =========================================================

  const getRuntimeDisplay = useCallback(
    (dg) => {
      const dgId = getDGKey(dg);
      const session = latestSessions[dgId];

      const runtime = getDGDailyRuntime(dg);

      // Prefer today's API runtime
      if (runtime) {
        const runtimeMinutes =
          runtime?.runtimeMinutes ??
          runtime?.totalRuntimeMinutes ??
          runtime?.minutes;

        if (
          runtimeMinutes !== undefined &&
          runtimeMinutes !== null
        ) {
          const minutes = Number(runtimeMinutes);

          if (!Number.isNaN(minutes)) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;

            if (hours > 0) {
              return `${hours}h ${mins}m`;
            }

            return `${mins}m`;
          }
        }
      }

      // Fallback to current session runtime
      if (session?.start) {
        return getRuntime(
          session.start,
          isRunning(session) ? null : session.stop
        );
      }

      return "--";
    },
    [
      getDGKey,
      latestSessions,
      getDGDailyRuntime,
      getRuntime,
      isRunning,
    ]
  );

  // =========================================================
  // Get session start/stop text
  // =========================================================

  const getSessionTimeText = useCallback(
    (dg) => {
      const dgId = getDGKey(dg);
      const session = latestSessions[dgId];

      if (!session) {
        return "No session data";
      }

      if (isRunning(session)) {
        return `Started ${formatDateTime(session.start)}`;
      }

      return `Stopped ${formatDateTime(session.stop)}`;
    },
    [
      getDGKey,
      latestSessions,
      isRunning,
      formatDateTime,
    ]
  );

  // =========================================================
  // Refresh
  // =========================================================

  const handleRefresh = async () => {
    await fetchDGs();
    await fetchDailyRuntime();
  };

  // =========================================================
  // Loading
  // =========================================================

  if (loadingDGs) {
    return (
      <ThemeProvider
        theme={themes.DGMONITORING}
        className="min-h-full pb-24"
      >
        <PageHeader
          title="DGMONITORING"
          subtitle="Monitor diesel generator status and electrical parameters"
          imageUrl="/ui/DGMONITORING.png"
        />

        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />

            <p className="text-sm text-gray-500">
              Loading generators...
            </p>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // =========================================================
  // Render
  // =========================================================

  return (
    <ThemeProvider
      theme={themes.DGMONITORING}
      className="min-h-full pb-24"
    >
      <PageHeader
        title="DGMONITORING"
        subtitle="Monitor diesel generator status and electrical parameters"
        imageUrl="/ui/DGMONITORING.png"
      />

      <div className="space-y-6">
        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-center justify-between gap-4">
            <p className="text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={handleRefresh}
              className="px-3 py-1.5 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* =====================================================
            SUMMARY CARDS
        ====================================================== */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          {/* Total DG */}

          <div className="rounded-xl lg:rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 lg:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-sm text-gray-500">
                  Total DG
                </p>

                <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                  {statistics.total}
                </h2>
              </div>

              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-gray-100 flex items-center justify-center text-sm sm:text-lg lg:text-xl">
                ⚡
              </div>
            </div>
          </div>

          {/* Running */}

          <div className="rounded-xl lg:rounded-2xl border border-green-200 bg-white p-3 sm:p-4 lg:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-sm text-gray-500">
                  Running
                </p>

                <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-green-600 mt-1 sm:mt-2">
                  {statistics.running}
                </h2>
              </div>

              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-green-50 flex items-center justify-center">
                <span className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Stopped */}

          <div className="rounded-xl lg:rounded-2xl border border-red-200 bg-white p-3 sm:p-4 lg:p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-sm text-gray-500">
                  Stopped
                </p>

                <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-red-500 mt-1 sm:mt-2">
                  {statistics.stopped}
                </h2>
              </div>

              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-red-50 flex items-center justify-center text-red-500 text-sm sm:text-lg">
                ■
              </div>
            </div>
          </div>

          {/* Refresh */}

          <button
            type="button"
            onClick={handleRefresh}
            className="group rounded-xl lg:rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/40 p-3 sm:p-4 lg:p-5 shadow-sm transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center justify-between h-full">
              <div className="text-left">
                <p className="text-[10px] sm:text-sm text-gray-500">
                  Monitoring
                </p>

                <h2 className="text-sm sm:text-lg lg:text-xl font-bold text-blue-600 mt-1 sm:mt-2">
                  Refresh Data
                </h2>
              </div>

              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-sm sm:text-lg lg:text-xl font-bold transition-transform group-hover:scale-110">
                ↻
              </div>
            </div>
          </button>
        </div>

        {/* =====================================================
            LIVE MONITORING
        ====================================================== */}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}

          <div className="px-4 sm:px-5 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Generator Monitoring
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Live electrical parameters and generator status
              </p>
            </div>

            <div className="flex items-center gap-3">
              {loadingSessions || loadingRuntime ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="w-2.5 h-2.5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                  Updating...
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                  Live monitoring
                </div>
              )}
            </div>
          </div>

          {/* Empty State */}

          {dgs.length === 0 ? (
            <div className="py-16 text-center">
              <div className="text-4xl mb-3">
                ⚡
              </div>

              <h3 className="text-lg font-semibold text-gray-800">
                No generators found
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                No DG records are available.
              </p>
            </div>
          ) : (
            /* ===================================================
               TABLE
            ==================================================== */

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase">
                    <th className="px-5 py-4">
                      DG
                    </th>

                    <th className="px-5 py-4">
                      Model
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                    <th className="px-5 py-4">
                      Voltage
                    </th>

                    <th className="px-5 py-4">
                      Current
                    </th>

                    <th className="px-5 py-4">
                      Capacity
                    </th>

                    <th className="px-5 py-4">
                      Runtime
                    </th>

                    <th className="px-5 py-4">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {dgs.map((dg) => {
                    const dgId = getDGKey(dg);

                    const session =
                      latestSessions[dgId];

                    const running =
                      isRunning(session);

                    return (
                      <tr
                        key={dgId}
                        className="hover:bg-gray-50 transition"
                      >
                        {/* DG */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-semibold">
                              {dg?.DGID ?? "--"}
                            </div>

                            <div>
                              <p className="font-semibold text-gray-900">
                                DG-
                                {String(
                                  dg?.DGID ?? "--"
                                ).padStart(2, "0")}
                              </p>

                              <p className="text-xs text-gray-500">
                                {dg?.SRNO ?? "--"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Model */}

                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-800">
                            {dg?.DGModel ?? "--"}
                          </p>

                          <p className="text-xs text-gray-500">
                            {dg?.phase
                              ? `${dg.phase} Phase`
                              : "3 Phase"}
                          </p>
                        </td>

                        {/* Status */}

                        <td className="px-5 py-4">
                          {running ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                              RUNNING
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
                              <span className="w-2 h-2 rounded-full bg-red-500" />
                              STOPPED
                            </span>
                          )}
                        </td>

                        {/* Voltage */}

                        <td className="px-5 py-4">
                          <span className="font-semibold text-gray-900">
                            {dg?.voltage ??
                              dg?.Voltage ??
                              "--"}
                          </span>

                          <span className="text-xs text-gray-500 ml-1">
                            V
                          </span>
                        </td>

                        {/* Current */}

                        <td className="px-5 py-4">
                          <span className="font-semibold text-gray-900">
                            {dg?.current ??
                              dg?.Current ??
                              "--"}
                          </span>

                          <span className="text-xs text-gray-500 ml-1">
                            A
                          </span>
                        </td>

                        {/* Capacity */}

                        <td className="px-5 py-4">
                          <span className="font-semibold text-gray-900">
                            {dg?.KVA ??
                              dg?.kva ??
                              "--"}
                          </span>

                          <span className="text-xs text-gray-500 ml-1">
                            KVA
                          </span>
                        </td>

                        {/* Runtime */}

                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-800">
                            {getRuntimeDisplay(dg)}
                          </p>

                          <p className="text-xs text-gray-500">
                            {getSessionTimeText(dg)}
                          </p>
                        </td>

                        {/* Action */}

                        <td className="px-5 py-4">
                          <button
                            type="button"
                            onClick={() =>
                               handleViewDG(dg)
                            }
                            className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* =======================================================
          DETAIL MODAL
      ======================================================== */}

      {selectedDG && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setSelectedDG(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Modal Header */}

            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  DG-
                  {String(
                    selectedDG?.DGID ?? "--"
                  ).padStart(2, "0")}{" "}
                  Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedDG?.DGModel ?? "--"}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedDG(null)
                }
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}

            <div className="p-5 space-y-5">
              {(() => {
                const dgId =
                  getDGKey(selectedDG);

                const session =
                  latestSessions[dgId];

                const running =
                  isRunning(session);

                return (
                  <>
                    {/* Status */}

                    <div
                      className={`rounded-xl p-4 ${
                        running
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500">
                            Current Status
                          </p>

                          <p
                            className={`font-semibold mt-1 ${
                              running
                                ? "text-green-700"
                                : "text-red-600"
                            }`}
                          >
                            {running
                              ? "RUNNING"
                              : "STOPPED"}
                          </p>
                        </div>

                        <span
                          className={`w-3 h-3 rounded-full ${
                            running
                              ? "bg-green-500 animate-pulse"
                              : "bg-red-500"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Details */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl bg-gray-50">
                        <p className="text-xs text-gray-500">
                          Serial Number
                        </p>

                        <p className="font-semibold mt-1">
                          {selectedDG?.SRNO ??
                            "--"}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-gray-50">
                        <p className="text-xs text-gray-500">
                          Voltage
                        </p>

                        <p className="font-semibold mt-1">
                          {selectedDG?.voltage ??
                            selectedDG?.Voltage ??
                            "--"}{" "}
                          V
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-gray-50">
                        <p className="text-xs text-gray-500">
                          Current
                        </p>

                        <p className="font-semibold mt-1">
                          {selectedDG?.current ??
                            selectedDG?.Current ??
                            "--"}{" "}
                          A
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-gray-50">
                        <p className="text-xs text-gray-500">
                          Capacity
                        </p>

                        <p className="font-semibold mt-1">
                          {selectedDG?.KVA ??
                            selectedDG?.kva ??
                            "--"}{" "}
                          KVA
                        </p>
                      </div>
                    </div>

                    {/* Session */}

                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Latest Session
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-gray-200">
                          <p className="text-xs text-gray-500">
                            Start Time
                          </p>

                          <p className="font-medium mt-1">
                            {formatDateTime(
                              session?.start
                            )}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl border border-gray-200">
                          <p className="text-xs text-gray-500">
                            Stop Time
                          </p>

                          <p className="font-medium mt-1">
                            {formatDateTime(
                              session?.stop
                            )}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl border border-gray-200">
                          <p className="text-xs text-gray-500">
                            Last Runtime
                          </p>

                          <p className="font-medium mt-1">
                            {getRuntimeDisplay(
                              selectedDG
                            )}
                          </p>
                        </div>

                        <div className="p-4 rounded-xl border border-gray-200">
                          <p className="text-xs text-gray-500">
                            Session Status
                          </p>

                          <p className="font-medium mt-1">
                            {session?.status ??
                              "--"}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* =====================================================
    DAY WISE RUNTIME
===================================================== */}

<div>
  <div className="flex items-center justify-between mb-3">
    <div>
      <h3 className="text-sm font-semibold text-gray-900">
        Day-wise Runtime
      </h3>

      <p className="text-xs text-gray-500 mt-1">
        Daily generator running time
      </p>
    </div>

    {loadingRuntime && (
      <span className="text-xs text-gray-500">
        Loading...
      </span>
    )}
  </div>

  {/* ================= SKELETON ================= */}

  {loadingRuntime ? (
    <div className="space-y-3">

      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="border border-gray-200 rounded-xl p-4 animate-pulse"
        >
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-200" />

              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded" />

                <div className="h-3 w-20 bg-gray-200 rounded" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-5 w-20 bg-gray-200 rounded" />

              <div className="h-3 w-24 bg-gray-200 rounded" />
            </div>

          </div>
        </div>
      ))}

    </div>

  ) : dailyRuntime.length === 0 ? (

    /* ================= EMPTY ================= */

    <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center">

      <div className="text-3xl mb-2">
        ⏱️
      </div>

      <p className="text-sm font-medium text-gray-700">
        No runtime data available
      </p>

      <p className="text-xs text-gray-500 mt-1">
        No runtime history found for this generator.
      </p>

    </div>

  ) : (

    /* ================= DATA ================= */

    <div className="space-y-3">

      {dailyRuntime.map((item, index) => {

        const runtimeMinutes = Number(
          item?.runtimeMinutes || 0
        );

        const hours = Math.floor(
          runtimeMinutes / 60
        );

        const minutes = Math.round(
          runtimeMinutes % 60
        );

        const runtime =
          hours > 0
            ? `${hours}h ${minutes}m`
            : `${minutes}m`;

        const date = item?.date
          ? new Date(item.date)
          : null;

        const formattedDate =
          date &&
          !Number.isNaN(date.getTime())
            ? date.toLocaleDateString("en-IN", {
                weekday: "short",
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "--";

        return (
          <div
            key={`${item?.date}-${index}`}
            className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center justify-between">

              {/* DATE */}

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  📅
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    {formattedDate}
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    DG-
                    {String(
                      selectedDG?.DGID ?? "--"
                    ).padStart(2, "0")}
                  </p>
                </div>

              </div>

              {/* RUNTIME */}

              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">
                  {runtime}
                </p>

                <p className="text-xs text-gray-500">
                  {runtimeMinutes.toFixed(2)} minutes
                </p>
              </div>

            </div>
          </div>
        );
      })}

    </div>
  )}
</div>

                  </>
                );
              })()}
            </div>

            {/* Modal Footer */}

            <div className="flex justify-end p-5 border-t border-gray-200">
              <button
                type="button"
                onClick={() =>
                  setSelectedDG(null)
                }
                className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </ThemeProvider>
  );
};

export default DGMonetoring;
