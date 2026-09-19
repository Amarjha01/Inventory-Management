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

const getWarrantyStatus = (purchaseDate, warrantyDuration) => {
  if (!purchaseDate || !warrantyDuration) {
    return {
      label: "Warranty unknown",
      className: "bg-slate-100 text-slate-500",
    };
  }

  // Extract number from values like:
  // "2 years"
  // "4 years"
  // "1 year"
  // "2"
  const match = String(warrantyDuration).match(/\d+/);

  if (!match) {
    return {
      label: "Warranty unknown",
      className: "bg-slate-100 text-slate-500",
    };
  }

  const warrantyYears = Number(match[0]);

  const purchase = new Date(purchaseDate);

  if (
    Number.isNaN(purchase.getTime()) ||
    Number.isNaN(warrantyYears)
  ) {
    return {
      label: "Warranty unknown",
      className: "bg-slate-100 text-slate-500",
    };
  }

  const expiryDate = new Date(purchase);

  expiryDate.setFullYear(
    expiryDate.getFullYear() + warrantyYears
  );

  const today = new Date();

  // Remove time component for date-only comparison
  today.setHours(0, 0, 0, 0);
  expiryDate.setHours(0, 0, 0, 0);

  const expiryYear = expiryDate.getFullYear();

  if (expiryDate >= today) {
    return {
      label: `Warranty till ${expiryYear}`,
      className: "bg-emerald-50 text-emerald-700",
    };
  }

  return {
    label: `Warranty expired ${expiryYear}`,
    className: "bg-red-50 text-red-600",
  };
};

const PurchaseCard = ({ record, onClick }) => {
  if (!record) return null;

  // const warranty = getWarrantyStatus(record.expiryWarrantyYear);

  return (
    <button
      type="button"
      onClick={() => onClick?.(record)}
      className="
        group
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        text-left
        shadow-sm
        transition
        duration-200
        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-md
        focus:outline-none
        focus:ring-2
        focus:ring-slate-200
      "
    >
      {/* =================================================
          TOP
      ================================================= */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
          border-b
          border-slate-100
          p-5
        "
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-slate-900
              text-white
            "
          >
            <FiPackage size={19} />
          </div>

          <div className="min-w-0">
            <p
              className="
                truncate
                text-sm
                font-bold
                text-slate-900
              "
            >
              {record.partyName || "Purchase Record"}
            </p>

            <p
              className="
                mt-0.5
                truncate
                text-[11px]
                text-slate-400
              "
            >
              {record.companyName || "Company not specified"}
            </p>
          </div>
        </div>

        <div
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-full
            text-slate-400
            transition
            group-hover:bg-slate-100
            group-hover:text-slate-700
          "
        >
          <FiChevronRight size={17} />
        </div>
      </div>

      {/* =================================================
          BODY
      ================================================= */}

      <div className="p-5">
        {/* Kitchen */}

        <div
          className="
            mb-4
            flex
            items-center
            justify-between
            gap-3
          "
        >
          <span
            className="
              truncate
              text-xs
              font-semibold
              text-slate-700
            "
          >
            {record.kitchenName || "Unknown Kitchen"}
          </span>

          <span
            className="
              shrink-0
              rounded-full
              bg-slate-100
              px-2.5
              py-1
              text-[10px]
              font-semibold
              text-slate-500
            "
          >
            Purchase
          </span>
        </div>

        {/* Information */}

        <div
          className="
            grid
            grid-cols-2
            gap-3
          "
        >
          {/* Purchase Date */}

          <div
            className="
              rounded-xl
              bg-slate-50
              p-3
            "
          >
            <div
              className="
                flex
                items-center
                gap-1.5
                text-[10px]
                font-semibold
                uppercase
                tracking-wide
                text-slate-400
              "
            >
              <FiCalendar size={12} />
              Purchase Date
            </div>

            <p
              className="
                mt-1.5
                text-xs
                font-semibold
                text-slate-700
              "
            >
              {formatDate(record.purchaseDate)}
            </p>
          </div>

          {/* Warranty */}

          <div
            className="
              rounded-xl
              bg-slate-50
              p-3
            "
          >
            <div
              className="
                flex
                items-center
                gap-1.5
                text-[10px]
                font-semibold
                uppercase
                tracking-wide
                text-slate-400
              "
            >
              <FiShield size={12} />
              Warranty
            </div>

            <p
              className="
                mt-1.5
                text-xs
                font-semibold
                text-slate-700
              "
            >
              {record.expiryWarrantyYear || "Not specified"}
            </p>
          </div>
        </div>

        {/* Warranty status */}
{/* 
        <div className="mt-4">
          <span
            className={`
              inline-flex
              items-center
              gap-1.5
              rounded-full
              px-2.5
              py-1
              text-[10px]
              font-semibold
              ${warranty.className}
            `}
          >
            <FiShield size={11} />

            {warranty.label}
          </span>
        </div> */}

        {/* Attachments */}

        {(record.guarantyPhoto || record.otherImage) && (
          <div
            className="
              mt-4
              flex
              items-center
              gap-2
              text-[10px]
              font-medium
              text-slate-400
            "
          >
            <FiFileText size={12} />
            Attachments available
          </div>
        )}
      </div>

      {/* =================================================
          FOOTER
      ================================================= */}

      <div
        className="
          flex
          items-center
          justify-between
          border-t
          border-slate-100
          px-5
          py-3
        "
      >
        <span
          className="
            text-[10px]
            font-medium
            text-slate-400
          "
        >
          Click to view details
        </span>

        <span
          className="
            text-[10px]
            font-semibold
            text-slate-500
            transition
            group-hover:text-slate-900
          "
        >
          View
        </span>
      </div>
    </button>
  );
};

export default PurchaseCard;
