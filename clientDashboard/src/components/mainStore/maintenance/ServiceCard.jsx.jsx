import React from "react";
import {
  FiArrowUpRight,
  FiCalendar,
  FiTool,
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

  if (record.kitchen?.name) {
    return record.kitchen.name;
  }

  return record.kitchenName || "Unknown Kitchen";
};

const ServiceCard = ({ record, onClick }) => {
  if (!record) return null;

  const kitchenName = getKitchenName(record);

  return (
    <button
      type="button"
      onClick={() => onClick?.(record)}
      className="group w-full rounded-xl border border-slate-200 bg-white p-3.5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-200 flex items-start md:items-center justify-between gap-4"
    >
      {/* Left Area: Icon & Main Details */}
      <div className="flex items-start md:items-center gap-3.5 min-w-0 flex-1">
        {/* Icon Badge */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white mt-0.5 md:mt-0">
          <FiTool size={18} />
        </div>

        {/* Text Container */}
        <div className="flex flex-col min-w-0 flex-1">
          {/* Top Row */}
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-bold text-slate-900">
              {record.partName || record.machineName || "Service Record"}
            </h3>
          </div>

          {/* Bottom Row */}
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 truncate">
            <span className="font-semibold text-slate-700 truncate">
              {kitchenName}
            </span>

            {record.partyName && (
              <>
                <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300"></span>
                <span className="truncate text-slate-600">
                  {record.partyName}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Middle Area */}
      <div className="hidden lg:flex items-center gap-6 text-xs text-slate-600 shrink-0 px-4">
        <div className="flex items-center gap-1.5">
          <FiCalendar size={13} className="text-slate-400 shrink-0" />

          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 leading-none">
              Service Date
            </span>

            <span className="font-medium text-slate-700 mt-0.5">
              {formatDate(record.serviceDate)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <FiCalendar size={13} className="text-slate-400 shrink-0" />

          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 leading-none">
              Next Service
            </span>

            <span className="font-medium text-slate-700 mt-0.5">
              {formatDate(record.nextServiceDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Right Area */}
      <div className="flex items-center shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-200 group-hover:bg-slate-900 group-hover:text-white group-hover:scale-105">
          <FiArrowUpRight size={16} />
        </div>
      </div>
    </button>
  );
};

export default ServiceCard;
