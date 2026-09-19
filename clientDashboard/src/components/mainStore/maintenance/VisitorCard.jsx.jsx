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

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

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

const getVisitor = (record) => {
  return record?.visitor || record;
};

const VisitorCard = ({ record, onClick }) => {
  if (!record) return null;

  const visitor = getVisitor(record);

  const isCompleted =
    visitor.status === "COMPLETED";

  const feedbackCount = Array.isArray(
    visitor.feedbackTrail
  )
    ? visitor.feedbackTrail.length
    : 0;

  return (
    <button
      type="button"
      onClick={() => onClick?.(record)}
      className="
        group w-full
        rounded-2xl
        border border-slate-200
        bg-white
        p-5
        text-left
        shadow-sm
        transition-all duration-200
        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-md
        focus:outline-none
        focus:ring-2
        focus:ring-slate-200
      "
    >
      {/* Header */}

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-xl
              bg-slate-100
              text-slate-600
              transition-colors
              group-hover:bg-slate-900
              group-hover:text-white
            "
          >
            <FiUser size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Visitor
            </p>

            <h3 className="mt-0.5 truncate text-sm font-bold text-slate-900">
              {visitor.visitorName ||
                visitor.name ||
                "Visitor Record"}
            </h3>
          </div>
        </div>

        <div
          className="
            flex h-8 w-8 shrink-0
            items-center justify-center
            rounded-full
            bg-slate-50
            text-slate-400
            transition-all
            group-hover:bg-slate-900
            group-hover:text-white
          "
        >
          <FiArrowUpRight size={15} />
        </div>
      </div>

      {/* Status */}

      <div className="mt-4">
        <span
          className={`
            inline-flex items-center gap-1.5
            rounded-full px-2.5 py-1
            text-[10px] font-bold
            ${
              isCompleted
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }
          `}
        >
          {isCompleted ? (
            <FiCheckCircle size={12} />
          ) : (
            <FiClock size={12} />
          )}

          {isCompleted
            ? "COMPLETED"
            : "PENDING"}
        </span>
      </div>

      <div className="my-5 h-px bg-slate-100" />

      {/* Information */}

      <div className="grid grid-cols-2 gap-x-5 gap-y-4">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
            Kitchen
          </p>

          <p className="mt-1 truncate text-xs font-semibold text-slate-700">
            {getKitchenName(record)}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
            Phone
          </p>

          <p className="mt-1 flex items-center gap-1.5 truncate text-xs font-semibold text-slate-700">
            <FiPhone
              size={12}
              className="shrink-0 text-slate-400"
            />

            {visitor.phoneNumber ||
              visitor.phone ||
              "—"}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
            Problem Date
          </p>

          <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <FiCalendar
              size={12}
              className="shrink-0 text-slate-400"
            />

            {formatDate(visitor.problemDate)}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
            Feedback
          </p>

          <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <FiMessageSquare
              size={12}
              className="shrink-0 text-slate-400"
            />

            {feedbackCount}{" "}
            {feedbackCount === 1
              ? "entry"
              : "entries"}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-[10px] text-slate-400">
          Click to view details
        </span>

        <span className="text-[10px] font-semibold text-slate-400 transition-colors group-hover:text-slate-900">
          View details
        </span>
      </div>
    </button>
  );
};

export default VisitorCard;