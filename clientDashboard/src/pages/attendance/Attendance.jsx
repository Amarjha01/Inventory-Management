import { useState } from "react";
import {
  FiClock,
  FiUsers,
  FiCalendar,
  FiLogIn,
  FiLogOut,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Attendance = () => {
  const [activeTab, setActiveTab] = useState("self");
  const [loading, setLoading] = useState(false);

  // These values will be loaded from the real attendance API.
  const [todayAttendance, setTodayAttendance] = useState(null);

  const navigate = useNavigate();
  const checkedIn = Boolean(todayAttendance?.checkIn);
  const checkedOut = Boolean(todayAttendance?.checkOut);

  const handleAttendanceAction = async (action) => {
    /*
     * Connect this to the backend check-in/check-out API
     * once the backend request and response contracts are confirmed.
     *
     * Do not mark attendance locally as successful: attendance
     * must only be confirmed after the server saves the record.
     */
    setLoading(true);

    try {
      toast.error(
        "Attendance API is not connected yet. Configure the backend first.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 pb-24 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <p className="text-sm font-medium text-indigo-600">
            Workforce Management
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">Attendance</h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage your attendance and record attendance for your team.
          </p>
        </header>
    // Inside the JSX:
          <button
            type="button"
            onClick={() => navigate("/attendance/add-employee")}
            className="rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            + Add Employee
          </button>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <FiCalendar className="mb-3 text-xl text-indigo-600" />

            <p className="text-sm text-slate-500">Today's date</p>

            <p className="mt-1 font-semibold text-slate-900">
              {new Intl.DateTimeFormat("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }).format(new Date())}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <FiClock className="mb-3 text-xl text-emerald-600" />

            <p className="text-sm text-slate-500">Your check-in</p>

            <p className="mt-1 font-semibold text-slate-900">
              {todayAttendance?.checkIn
                ? new Date(todayAttendance.checkIn).toLocaleTimeString(
                    "en-IN",
                    { hour: "2-digit", minute: "2-digit" },
                  )
                : "Not checked in"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <FiUsers className="mb-3 text-xl text-violet-600" />

            <p className="text-sm text-slate-500">Team attendance</p>

            <p className="mt-1 font-semibold text-slate-900">
              Connected after API setup
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
            <button
              type="button"
              onClick={() => setActiveTab("self")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                activeTab === "self"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              My Attendance
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("team")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                activeTab === "team"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Employee Attendance
            </button>
          </div>

          {activeTab === "self" ? (
            <div className="py-6">
              <h2 className="text-lg font-bold text-slate-900">
                Mark your attendance
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Check in when your shift starts and check out when it ends.
              </p>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Check-in</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {checkedIn
                      ? new Date(todayAttendance.checkIn).toLocaleTimeString(
                          "en-IN",
                        )
                      : "Pending"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Check-out</p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {checkedOut
                      ? new Date(todayAttendance.checkOut).toLocaleTimeString(
                          "en-IN",
                        )
                      : "Pending"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={loading || checkedIn}
                  onClick={() => handleAttendanceAction("check-in")}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiLogIn />
                  Check In
                </button>

                <button
                  type="button"
                  disabled={loading || !checkedIn || checkedOut}
                  onClick={() => handleAttendanceAction("check-out")}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiLogOut />
                  Check Out
                </button>
              </div>
            </div>
          ) : (
            <div className="py-6">
              <h2 className="text-lg font-bold text-slate-900">
                Employee attendance
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                This section will load employees assigned to your authorized
                kitchen or work location. You will be able to select an employee
                and record their attendance.
              </p>

              <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-6 text-center">
                <FiUsers className="mx-auto text-3xl text-slate-400" />

                <p className="mt-3 font-semibold text-slate-700">
                  Employee list not connected
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Waiting for the employee API and authorization rules.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
