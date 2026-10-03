import React, { useMemo, useState } from "react";
import ThemeProvider from "../../../components/shared/ui/ThemeProvider";
import { themes } from "../../../components/shared/ui/Theme";
import PageHeader from "../../../components/shared/ui/PageHeader";
import { addDG, getAllDG, getDailyRuntime, getLatestDGSession } from "../../../services/dgmonetoring.service";
import { useEffect } from "react";

const DGMonetoring = () => {
  const [selectedDG, setSelectedDG] = useState(null);
  const [dgs, setDgs] = useState([]);
  const [latestSession, setLatestSession] = useState(null);

  useEffect(() => {
    const fetchDGs = async () => {
      try {
        const response = await getAllDG();
        console.log(response);
        
        setDgs(response.data || []);
      } catch (error) {
        console.error("Failed to fetch DGs:", error);
      }
    };
    fetchDGs()
  },[]);

const [dailyRuntime, setDailyRuntime] = useState([]);

useEffect(() => {

    const fetchDailyRuntime = async () => {

        try {
          const today = new Date().toISOString().split("T")[0];
            const response = await getDailyRuntime(today);

            setDailyRuntime(response.data || []);

        } catch (error) {

            console.error(error);

        }
    };

    fetchDailyRuntime();

}, []);

useEffect(() => {

    const fetchLatestSession = async () => {

        try {

            const response = await getLatestDGSession("6ac0c6adcde799bc04f9fda3");

            console.log("Latest DG Session:", response);

            setLatestSession(response.data);

        } catch (error) {

            console.error(
                "Failed to fetch latest DG session:",
                error
            );

        }
    };

    fetchLatestSession();

}, []);
  // Temporary mock data.
  // Later this will come from your API.
  const dgData = [
    {
      id: "DG-001",
      dgNumber: 1,
      model: "Cummins C275D5",
      srNo: "CUM-2024-001",
      voltage: 415,
      current: 238,
      kva: 275,
      phase: "3 Phase",
      status: "START",
      start: "2026-09-30T08:32:00",
      stop: null,
    },
  ];

  const statistics = useMemo(() => {
    const running = dgData.filter((dg) => dg.status === "START").length;

    const stopped = dgData.filter((dg) => dg.status === "STOP").length;

    const totalKVA = dgData
      .filter((dg) => dg.status === "START")
      .reduce((sum, dg) => sum + dg.kva, 0);

    return {
      total: dgData.length,
      running,
      stopped,
      totalKVA,
    };
  }, [dgData]);

  const formatDateTime = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRuntime = (start) => {
    if (!start) return "--";

    const startTime = new Date(start);
    const now = new Date();

    const diff = Math.max(0, Math.floor((now - startTime) / 1000));

    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    return `${hours}h ${minutes}m`;
  };

  return (
    <ThemeProvider theme={themes.DGMONITORING} className="min-h-full pb-24">
      <PageHeader
        title="DGMONITORING"
        subtitle="Monitor diesel generator status and electrical parameters"
        imageUrl="/ui/DGMONITORING.png"
      />

      <div className=" space-y-6 ">
        {/* =======================
            SUMMARY CARDS
        ======================== */}

        <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:gap-4 sticky top-[8%]">
          {/* Total DG */}
          <div className="rounded-xl lg:rounded-2xl border border-gray-200 p-3 sm:p-4 lg:p-5 shadow-sm backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-sm text-gray-500">Total DG</p>

                <h2 className="text-xs sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
                  {statistics.total}
                </h2>
              </div>

              <div className="w-5 h-5 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-gray-100 flex items-center justify-center text-sm sm:text-lg lg:text-xl">
                ⚡
              </div>
            </div>
          </div>

          {/* Running */}
          <div className="rounded-xl lg:rounded-2xl border border-green-200 p-3 sm:p-4 lg:p-5 shadow-sm backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-sm text-gray-500">Running</p>

                <h2 className="text-xs sm:text-2xl lg:text-3xl font-bold text-green-600 mt-1 sm:mt-2">
                  {statistics.running}
                </h2>
              </div>

              <div className="w-5 h-5 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-green-50 flex items-center justify-center">
                <span className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Stopped */}
          <div className="rounded-xl lg:rounded-2xl border border-red-200 p-3 sm:p-4 lg:p-5 shadow-sm backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-sm text-gray-500">Stopped</p>

                <h2 className="text-xs sm:text-2xl lg:text-3xl font-bold text-red-500 mt-1 sm:mt-2">
                  {statistics.stopped}
                </h2>
              </div>

              <div className="w-5 h-5 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-red-50 flex items-center justify-center text-red-500 text-sm sm:text-lg">
                ■
              </div>
            </div>
          </div>
          {/* add dg*/}
          {/* Add New DG */}
          <button
            type="button"
            onClick={() => setIsAddDGOpen(true)}
            className="group rounded-xl lg:rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/40 p-3 sm:p-4 lg:p-5 shadow-sm transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center justify-between h-full">
              <div className="text-left">
                <p className="text-[10px] sm:text-sm text-gray-500">
                  Generator
                </p>
                <h2 className="text-[10px] sm:text-lg lg:text-xl font-bold text-blue-600 mt-1 sm:mt-2 whitespace-nowrap">
                  Add New DG
                </h2>
              </div>

              <div className="w-5 h-5 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 text-sm sm:text-lg lg:text-xl font-bold transition-transform group-hover:scale-110">
                +
              </div>
            </div>
          </button>
        </div>

        {/* =======================
            LIVE DG MONITORING
        ======================== */}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden ">
          <div className="px-5 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Generator Monitoring
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Live electrical parameters and generator status
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              Live monitoring
            </div>
          </div>

          {/* =======================
              TABLE
          ======================== */}

          <div className="overflow-x-auto bg-amber-400">
            <table className="w-full min-w-250">
              <thead className="bg-gray-50 border-b border-gray-200 ">
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase">
                  <th className="px-5 py-4">DG</th>

                  <th className="px-5 py-4">Model</th>

                  <th className="px-5 py-4">Status</th>

                  <th className="px-5 py-4">Voltage</th>

                  <th className="px-5 py-4">Current</th>

                  <th className="px-5 py-4">Capacity</th>

                  <th className="px-5 py-4">Runtime</th>

                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {dgs.map((dg) => (
                  <tr key={dg._id} className="hover:bg-gray-50 transition">
                    {/* DG */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-semibold">
                          {dg?.DGID}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            DG-{String(dg?.DGID).padStart(2, "0")}
                          </p>

                          <p className="text-xs text-gray-500">{dg?.SRNO}</p>
                        </div>
                      </div>
                    </td>

                    {/* Model */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">{dg.DGModel}</p>

                      <p className="text-xs text-gray-500">{dg.phase} Phase</p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      {latestSession.status === "RUNNING" ? (
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
                        {dg.voltage}
                      </span>

                      <span className="text-xs text-gray-500 ml-1">V</span>
                    </td>

                    {/* Current */}
                    <td className="px-5 py-4">
                      <span className="font-semibold text-gray-900">
                        {dg.current}
                      </span>

                      <span className="text-xs text-gray-500 ml-1">A</span>
                    </td>

                    {/* KVA */}
                    <td className="px-5 py-4">
                      <span className="font-semibold text-gray-900">
                        {dg.KVA}
                      </span>

                      <span className="text-xs text-gray-500 ml-1">KVA</span>
                    </td>

                    {/* Runtime */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">
                        {dailyRuntime[0].runtimeMinutes} min
                      </p>

                      <p className="text-xs text-gray-500">
                        {latestSession.status === "RUNNING"
                          ? `Started ${formatDateTime(latestSession.start)}`
                          : `Stopped ${formatDateTime(latestSession.stop)}`}
                      </p>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedDG(dg)}
                        className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* =======================
            DETAIL PANEL
        ======================== */}

        {selectedDG && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 fixed top-[50%] right-[30%] ">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold">
                  DG-{String(selectedDG.DGID).padStart(2, "0")} Details
                </h2>

                <p className="text-sm text-gray-500">{selectedDG.DGModel}</p>
              </div>

              <button
                onClick={() => setSelectedDG(null)}
                className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-100"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-xs text-gray-500">Serial Number</p>

                <p className="font-semibold mt-1">{selectedDG.SRNO}</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-xs text-gray-500">Voltage</p>

                <p className="font-semibold mt-1">{selectedDG.voltage} V</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-xs text-gray-500">Current</p>

                <p className="font-semibold mt-1">{selectedDG.current} A</p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-xs text-gray-500">Capacity</p>

                <p className="font-semibold mt-1">{selectedDG.KVA} KVA</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default DGMonetoring;
