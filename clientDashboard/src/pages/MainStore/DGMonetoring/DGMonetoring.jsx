import React, { useMemo, useState } from "react";
import ThemeProvider from "../../../components/shared/ui/ThemeProvider";
import { themes } from "../../../components/shared/ui/Theme";
import PageHeader from "../../../components/shared/ui/PageHeader";

const DGMonetoring = () => {
  const [selectedDG, setSelectedDG] = useState(null);

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
    {
      id: "DG-002",
      dgNumber: 2,
      model: "Kirloskar KG1-250",
      srNo: "KIR-2024-002",
      voltage: 415,
      current: 0,
      kva: 250,
      phase: "3 Phase",
      status: "STOP",
      start: null,
      stop: "2026-09-30T06:15:00",
    },
    {
      id: "DG-003",
      dgNumber: 3,
      model: "Mahindra Powerol",
      srNo: "MHP-2024-003",
      voltage: 415,
      current: 182,
      kva: 200,
      phase: "3 Phase",
      status: "START",
      start: "2026-09-30T10:05:00",
      stop: null,
    },
    {
      id: "DG-003",
      dgNumber: 3,
      model: "Mahindra Powerol",
      srNo: "MHP-2024-003",
      voltage: 415,
      current: 182,
      kva: 200,
      phase: "3 Phase",
      status: "START",
      start: "2026-09-30T10:05:00",
      stop: null,
    },
    {
      id: "DG-003",
      dgNumber: 3,
      model: "Mahindra Powerol",
      srNo: "MHP-2024-003",
      voltage: 415,
      current: 182,
      kva: 200,
      phase: "3 Phase",
      status: "START",
      start: "2026-09-30T10:05:00",
      stop: null,
    },
    {
      id: "DG-003",
      dgNumber: 3,
      model: "Mahindra Powerol",
      srNo: "MHP-2024-003",
      voltage: 415,
      current: 182,
      kva: 200,
      phase: "3 Phase",
      status: "START",
      start: "2026-09-30T10:05:00",
      stop: null,
    },
    {
      id: "DG-003",
      dgNumber: 3,
      model: "Mahindra Powerol",
      srNo: "MHP-2024-003",
      voltage: 415,
      current: 182,
      kva: 200,
      phase: "3 Phase",
      status: "START",
      start: "2026-09-30T10:05:00",
      stop: null,
    },
    {
      id: "DG-003",
      dgNumber: 3,
      model: "Mahindra Powerol",
      srNo: "MHP-2024-003",
      voltage: 415,
      current: 182,
      kva: 200,
      phase: "3 Phase",
      status: "START",
      start: "2026-09-30T10:05:00",
      stop: null,
    },
    {
      id: "DG-003",
      dgNumber: 3,
      model: "Mahindra Powerol",
      srNo: "MHP-2024-003",
      voltage: 415,
      current: 182,
      kva: 200,
      phase: "3 Phase",
      status: "START",
      start: "2026-09-30T10:05:00",
      stop: null,
    },
    {
      id: "DG-003",
      dgNumber: 3,
      model: "Mahindra Powerol",
      srNo: "MHP-2024-003",
      voltage: 415,
      current: 182,
      kva: 200,
      phase: "3 Phase",
      status: "START",
      start: "2026-09-30T10:05:00",
      stop: null,
    },
    {
      id: "DG-003",
      dgNumber: 3,
      model: "Mahindra Powerol",
      srNo: "MHP-2024-003",
      voltage: 415,
      current: 182,
      kva: 200,
      phase: "3 Phase",
      status: "START",
      start: "2026-09-30T10:05:00",
      stop: null,
    },
    {
      id: "DG-003",
      dgNumber: 3,
      model: "Mahindra Powerol",
      srNo: "MHP-2024-003",
      voltage: 415,
      current: 182,
      kva: 200,
      phase: "3 Phase",
      status: "START",
      start: "2026-09-30T10:05:00",
      stop: null,
    },
    {
      id: "DG-003",
      dgNumber: 3,
      model: "Mahindra Powerol",
      srNo: "MHP-2024-003",
      voltage: 415,
      current: 182,
      kva: 200,
      phase: "3 Phase",
      status: "START",
      start: "2026-09-30T10:05:00",
      stop: null,
    },
    {
      id: "DG-003",
      dgNumber: 3,
      model: "Mahindra Powerol",
      srNo: "MHP-2024-003",
      voltage: 415,
      current: 182,
      kva: 200,
      phase: "3 Phase",
      status: "START",
      start: "2026-09-30T10:05:00",
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

      <div className="px-4 md:px-6 lg:px-8 space-y-6 ">
        {/* =======================
            SUMMARY CARDS
        ======================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sticky top-[8%]">
          {/* Total DG */}
          <div className="rounded-2xl  border border-gray-200 p-5 shadow-sm backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total DG</p>

                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {statistics.total}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
                ⚡
              </div>
            </div>
          </div>

          {/* Running */}
          <div className="rounded-2xl  border border-green-200 p-5 shadow-sm backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Running</p>

                <h2 className="text-3xl font-bold text-green-600 mt-2">
                  {statistics.running}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center ">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Stopped */}
          <div className="rounded-2xl  border border-red-200 p-5 shadow-sm backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Stopped</p>

                <h2 className="text-3xl font-bold text-red-500 mt-2">
                  {statistics.stopped}
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                ■
              </div>
            </div>
          </div>

          {/* Available KVA */}
          <div className="rounded-2xl  border border-blue-200 p-5 shadow-sm backdrop-blur-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Running Capacity</p>

                <h2 className="text-3xl font-bold text-blue-600 mt-2">
                  {statistics.totalKVA}
                  <span className="text-sm font-medium ml-1">KVA</span>
                </h2>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                ⚙
              </div>
            </div>
          </div>
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

          <div className="overflow-x-auto overflow-y-scroll bg-amber-400">
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
                {dgData.map((dg) => (
                  <tr key={dg.id} className="hover:bg-gray-50 transition">
                    {/* DG */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-semibold">
                          {dg.dgNumber}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            DG-{String(dg.dgNumber).padStart(2, "0")}
                          </p>

                          <p className="text-xs text-gray-500">{dg.srNo}</p>
                        </div>
                      </div>
                    </td>

                    {/* Model */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">{dg.model}</p>

                      <p className="text-xs text-gray-500">{dg.phase}</p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      {dg.status === "START" ? (
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
                        {dg.kva}
                      </span>

                      <span className="text-xs text-gray-500 ml-1">KVA</span>
                    </td>

                    {/* Runtime */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">
                        {dg.status === "START" ? getRuntime(dg.start) : "--"}
                      </p>

                      <p className="text-xs text-gray-500">
                        {dg.status === "START"
                          ? `Started ${formatDateTime(dg.start)}`
                          : `Stopped ${formatDateTime(dg.stop)}`}
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
                  DG-{String(selectedDG.dgNumber).padStart(2, "0")} Details
                </h2>

                <p className="text-sm text-gray-500">{selectedDG.model}</p>
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

                <p className="font-semibold mt-1">{selectedDG.srNo}</p>
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

                <p className="font-semibold mt-1">{selectedDG.kva} KVA</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default DGMonetoring;
