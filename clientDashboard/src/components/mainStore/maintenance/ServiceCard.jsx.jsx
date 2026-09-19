import React from "react";
import { FiArrowUpRight, FiCalendar, FiTool } from "react-icons/fi";

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

  if (record.kitchen?.name) {
    return record.kitchen.name;
  }

  return record.kitchenName || "Unknown Kitchen";
};

const Info = ({ label, value }) => {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-semibold text-slate-700">
        {value || "—"}
      </p>
    </div>
  );
};

const ServiceCard = ({ record, onClick }) => {
  if (!record) return null;

  const kitchenName = getKitchenName(record);

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
      {/* =================================================
          HEADER
      ================================================= */}

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
            <FiTool size={18} />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Service
            </p>

            <h3 className="mt-0.5 truncate text-sm font-bold text-slate-900">
              {record.partName || record.machineName || "Service Record"}
            </h3>
          </div>
        </div>

        {/* Arrow */}

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

      {/* =================================================
          DIVIDER
      ================================================= */}

      <div className="my-5 h-px bg-slate-100" />

      {/* =================================================
          INFORMATION
      ================================================= */}

      <div className="grid grid-cols-2 gap-x-5 gap-y-4">
        <Info label="Kitchen" value={kitchenName} />

        <Info label="Party" value={record.partyName} />

        <Info label="Service Date" value={formatDate(record.serviceDate)} />

        <Info label="Next Service" value={formatDate(record.nextServiceDate)} />
      </div>

      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex min-w-0 items-center gap-2">
          <FiCalendar size={13} className="shrink-0 text-slate-400" />

          <span className="truncate text-[10px] text-slate-400">
            Created {formatDate(record.createdAt)}
          </span>
        </div>

        <span className="shrink-0 text-[10px] font-semibold text-slate-400 transition-colors group-hover:text-slate-900">
          View details
        </span>
      </div>
    </button>
  );
};

export default ServiceCard;
