import React from "react";
import {
  FiCalendar,
  FiChevronRight,
  FiFileText,
  FiPackage,
  FiShield,
} from "react-icons/fi";

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const PurchaseCard = ({ record, onClick }) => {
  if (!record) return null;

  const hasAttachments = Boolean(record.guarantyPhoto || record.otherImage);
  const partName =
    record.purchaseRecord?.partName || record.partyName || "Purchase Record";

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
      {/* Left Area: Icon & Main Details */}
      <div className="flex items-start md:items-center gap-3.5 min-w-0 flex-1">
        
        {/* Icon Badge */}
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
          <FiPackage size={18} />
        </div>

        {/* Text Container */}
        <div className="flex flex-col min-w-0 flex-1">
          {/* Top Row: Part/Party Name & Type Badge */}
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-bold text-slate-900">
              {partName}
            </h3>
          </div>

          {/* Bottom Row: Company Name & Kitchen Name */}
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 truncate">
            <span className="truncate">
              {record.companyName || "Company not specified"}
            </span>

            <span className="h-1 w-1 shrink-0 rounded-full bg-slate-300"></span>

            <span className="font-semibold text-slate-700 truncate">
              {record.kitchenName || "Unknown Kitchen"}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Area: Compact Metadata (Desktop Only) */}
      <div className="hidden lg:flex items-center gap-6 text-xs text-slate-600 shrink-0 px-4">
        <div className="flex items-center gap-1.5">
          <FiCalendar size={13} className="text-slate-400 shrink-0" />
          <span className="font-medium text-slate-700">
            {formatDate(record.purchaseDate)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <FiShield size={13} className="text-slate-400 shrink-0" />
          <span className="font-medium text-slate-700">
            {record.expiryWarrantyYear || "No warranty"}
          </span>
        </div>

        {hasAttachments && (
          <div className="flex items-center gap-1.5 text-slate-400">
            <FiFileText size={13} className="shrink-0" />
            <span className="font-medium text-slate-500">Attached</span>
          </div>
        )}
      </div>

      {/* Right Area: Action Arrow Button */}
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
          <FiChevronRight size={16} />
        </div>
      </div>
    </button>
  );
};

export default PurchaseCard;