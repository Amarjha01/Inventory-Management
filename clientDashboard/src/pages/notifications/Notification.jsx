import React, { useCallback, useEffect, useState } from "react";
import { FiBell, FiRefreshCw, FiSearch, FiX } from "react-icons/fi";



import NotificationCard from "../../components/shared/notifications/NotificationCard";
import NotificationEmpty from "../../components/shared/notifications/NotificationEmpty";
import NotificationSkeleton from "../../components/shared/notifications/NotificationSkeleton";
import { getKitchenNotifications } from "../../services/notification";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [error, setError] = useState("");

  const fetchNotifications = useCallback(
    async ({ refresh = false } = {}) => {
      try {
        setError("");

        if (refresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const params = {};

        if (selectedDate) {
          params.date = selectedDate;
        }

        const data = await getKitchenNotifications(params);

        setNotifications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);

        setError(
          error?.response?.data?.message || "Failed to load notifications.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedDate],
  );

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  /* =========================================
     SEARCH
  ========================================= */

  const filteredNotifications = notifications.filter((notification) => {
    if (!search.trim()) {
      return true;
    }

    const query = search.toLowerCase();

    const title = notification.title?.toLowerCase() || "";

    const message = notification.message?.toLowerCase() || "";

    return title.includes(query) || message.includes(query);
  });

  /* =========================================
     CARD CLICK
  ========================================= */

  const handleNotificationClick = (notification) => {
    console.log("Notification clicked:", notification);

    // Later:
    // mark as read
    // navigate to related entity
    // open notification detail modal
  };

  /* =========================================
     MENU
  ========================================= */

  const handleMenuClick = (notification) => {
    console.log("Notification menu:", notification);

    // Later:
    // mark as read
    // delete
    // archive
  };

  /* =========================================
     CLEAR SEARCH
  ========================================= */

  const clearSearch = () => {
    setSearch("");
  };

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto w-full max-w-5xl">
        {/* =====================================
            PAGE HEADER
        ===================================== */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                <FiBell size={20} />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Updates</p>
                <h1 className="text-xl font-bold text-slate-900">Notifications</h1>
              </div>
            </div>

            {/* Refresh */}
            <button
              type="button"
              onClick={() => fetchNotifications({ refresh: true })}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiRefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* =====================================
            FILTER BAR
        ===================================== */}
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search notifications..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-9 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
            />
            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <FiX size={15} />
              </button>
            )}
          </div>

          {/* Date */}
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-medium text-slate-600 outline-none focus:border-slate-400 focus:bg-white"
          />
        </div>

        {/* =====================================
            CONTENT STATES
        ===================================== */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <NotificationSkeleton key={index} />
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <NotificationEmpty />
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id || notification._id}
                notification={notification}
                onClick={handleNotificationClick}
                onMenuClick={handleMenuClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;
