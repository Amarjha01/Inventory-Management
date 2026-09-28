import React from "react";
import {
  FiArrowUpRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiMessageSquare,
  FiPhone,
  FiUser,
} from "react-icons/fi";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getKitchenName = (record) => {
  if (!record) return "Unknown Kitchen";
  if (typeof record.kitchenId === "object") {
    return (
      record.kitchenId?.name ||
      record.kitchenId?.kitchenName ||
      "Unknown Kitchen"
    );
  }
  return record.kitchenName || "Unknown Kitchen";
};

const getVisitor = (record) => record?.visitor || record;

const VisitorCard = ({ record, onClick }) => {
  if (!record) return null;

  const visitor = getVisitor(record);
  const isCompleted = visitor.status === "COMPLETED";
  const feedbackCount = Array.isArray(visitor.feedbackTrail)
    ? visitor.feedbackTrail.length
    : 0;

  return (
    <button
      type="button"
      onClick={() => onClick?.(record)}
      className="
        group w-full
        rounded-xl
        border border-slate-200
        bg-white
        p-3.5
        text-left
        shadow-sm
        transition-all duration-200
        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-md
        focus:outline-none
        focus:ring-2
        focus:ring-slate-200
        flex items-start md:items-center justify-between
        gap-4
      "
    >
      {/* Left Area: Avatar & Main Info */}
      <div className="flex items-start md:items-center gap-3.5 min-w-0 flex-1">
        
        {/* Avatar */}
        <div
          className="
            flex h-10 w-10 shrink-0
            items-center justify-center
            rounded-lg
            bg-slate-900
            text-white
            mt-0.5 md:mt-0
          "
        >
          <FiUser size={18} />
        </div>

        {/* Text Container */}
        <div className="flex flex-col min-w-0 flex-1">
          {/* Top Row: Name & Status */}
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-bold text-slate-900">
              {visitor.visitorName || visitor.name || "Visitor Record"}
            </h3>

            <span
              className={`
                inline-flex items-center gap-1
                rounded-full px-2 py-0.5
                text-[9px] font-bold tracking-wide shrink-0
                ${
                  isCompleted
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }
              `}
            >
              {isCompleted ? <FiCheckCircle size={10} /> : <FiClock size={10} />}
              {isCompleted ? "COMPLETED" : "PENDING"}
            </span>
          </div>

          {/* Bottom Row: Kitchen & Reason */}
          <div className="mt-1 flex flex-col md:flex-row md:items-start gap-1 md:gap-2 text-xs">
            <span className="font-semibold text-slate-500 shrink-0">
              {getKitchenName(record)}
            </span>
            
            {/* Separator dot visible only on desktop */}
            <span className="hidden md:flex mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-300"></span>

            {/* Reason - Allows wrapping but capped at 2 lines to keep UI neat */}
            <span className="text-slate-600 font-medium whitespace-normal break-words line-clamp-2">
              {visitor.reason || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Area: Compact Metadata (Desktop Only) */}
      <div className="hidden lg:flex items-center gap-6 text-xs text-slate-600 shrink-0 px-4">
        <div className="flex items-center gap-1.5">
          <FiPhone size={13} className="text-slate-400 shrink-0" />
          <span className="font-medium text-slate-700">
            {visitor.phoneNumber || visitor.phone || "—"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <FiCalendar size={13} className="text-slate-400 shrink-0" />
          <span className="font-medium text-slate-700">
            {formatDate(visitor.problemDate)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <FiMessageSquare size={13} className="text-slate-400 shrink-0" />
          <span className="font-medium text-slate-700">
            {feedbackCount} {feedbackCount === 1 ? "entry" : "entries"}
          </span>
        </div>
      </div>

      {/* Right Area: Action Arrow */}
      <div className="flex items-center shrink-0">
        <div
          className="
            flex h-8 w-8 items-center justify-center
            rounded-full
            bg-slate-50
            text-slate-400
            transition-all duration-200
            group-hover:bg-slate-900
            group-hover:text-white
            group-hover:scale-105
          "
        >
          <FiArrowUpRight size={16} />
        </div>
      </div>
    </button>
  );
};

export default VisitorCard;