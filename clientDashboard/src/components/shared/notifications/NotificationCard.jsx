import React from "react";
import { FiBell, FiCalendar, FiMoreVertical } from "react-icons/fi";

const formatDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
};

const NotificationCard = ({ notification, onClick, onMenuClick }) => {
  if (!notification) return null;

  return (
    <button
      type="button"
      onClick={() => onClick?.(notification)}
      className="group relative w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-200"
    >
      {/* ========================================= HEADER ========================================= */}
      <div className="flex items-start gap-4">
        {/* Notification icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors group-hover:bg-slate-900 group-hover:text-white">
          <FiBell size={18} />
        </div>

        {/* Title + date */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Notification
              </p>
              <h3 className="mt-1 truncate text-sm font-bold text-slate-900">
                {notification.title || "Notification"}
              </h3>
            </div>

            {/* Menu */}
            <span
              role="button"
              tabIndex={0}
              onClick={(event) => {
                event.stopPropagation();
                onMenuClick?.(notification, event);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.stopPropagation();
                  onMenuClick?.(notification, event);
                }
              }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <FiMoreVertical size={17} />
            </span>
          </div>

          {/* Date */}
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
            <FiCalendar size={12} />
            {formatDateTime(notification.createdAt || notification.date)}
          </div>
        </div>
      </div>

      {/* ========================================= DIVIDER ========================================= */}
      <div className="my-4 h-px bg-slate-100" />

      {/* ========================================= MESSAGE ========================================= */}
      <div className="pl-0">
        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
          {notification.message || "No message available."}
        </p>
      </div>
    </button>
  );
};

export default NotificationCard;
