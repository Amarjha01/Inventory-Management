import React, { useEffect, useMemo, useState } from "react";
import { getAllMaintenanceForAdmin } from "../../../services/maintainence.service";
import { parseAnimateLayoutArgs } from "framer-motion";
const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL

const Maintenance = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Kitchen -> true/false
  const [expandedKitchens, setExpandedKitchens] = useState({});

  // Kitchen -> category -> true/false
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllMaintenanceForAdmin();

      /*
       * API response:
       *
       * {
       *   success: true,
       *   message: "...",
       *   data: [...]
       * }
       *
       * Therefore use response.data
       */
      setMaintenance(response || []);
    } catch (error) {
      console.error("Failed to fetch maintenance:", error);

      setError(
        error?.response?.data?.message ||
          "Failed to load maintenance records."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Group maintenance records by kitchen
  |--------------------------------------------------------------------------
  */

  const kitchens = useMemo(() => {
    const grouped = {};
    console.log(maintenance);
    maintenance.forEach((record) => {
      
      
      const kitchenId =
        record?.kitchenId?._id ||
        record?.kitchenId ||
        "unknown";

      const kitchenName =
        record?.kitchenId?.name ||
        "Unknown Kitchen";

      if (!grouped[kitchenId]) {
        grouped[kitchenId] = {
          _id: kitchenId,
          name: kitchenName,
          records: [],
        };
      }

      grouped[kitchenId].records.push(record);
    });

    return Object.values(grouped);
  }, [maintenance]);

  /*
  |--------------------------------------------------------------------------
  | Get category records for a kitchen
  |--------------------------------------------------------------------------
  */

  const getCategoryRecords = (records, category) => {
    console.log(records , category);
    
    return records.filter((record) => {
      if (category === "service") {
        return !!record?.service;
      }

      if (category === "visitor") {
        return !!record?.visitor;
      }

      if (category === "purchase") {
        return !!record?.purchaseRecord;
      }

      return false;
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Toggle Kitchen
  |--------------------------------------------------------------------------
  */

  const toggleKitchen = (kitchenId) => {
    setExpandedKitchens((prev) => ({
      ...prev,
      [kitchenId]: !prev[kitchenId],
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Toggle Category
  |--------------------------------------------------------------------------
  */

  const toggleCategory = (kitchenId, category) => {
    const key = `${kitchenId}-${category}`;

    setExpandedCategories((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Format Date
  |--------------------------------------------------------------------------
  */

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

  /*
  |--------------------------------------------------------------------------
  | Image URL
  |--------------------------------------------------------------------------
  */

  const getImageUrl = (image) => {
    if (!image) return "";

    return `${BASE_URL}/uploads/maintenance/${image}`;
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 rounded bg-gray-200" />

          <div className="h-20 rounded-xl bg-gray-200" />
          <div className="h-20 rounded-xl bg-gray-200" />
          <div className="h-20 rounded-xl bg-gray-200" />
        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="font-medium text-red-700">
            {error}
          </p>

          <button
            onClick={fetchMaintenance}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* ------------------------------------------------------------------ */}
      {/* Header */}
      {/* ------------------------------------------------------------------ */}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Maintenance
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage maintenance records kitchen-wise
          </p>
        </div>

        <div className="rounded-lg bg-white px-4 py-2 shadow-sm ring-1 ring-gray-200">
          <span className="text-sm text-gray-500">
            Total Records
          </span>

          <span className="ml-2 font-semibold text-gray-900">
            {maintenance.length}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Empty */}
      {/* ------------------------------------------------------------------ */}

      {kitchens.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <div className="text-4xl">🔧</div>

          <h2 className="mt-3 text-lg font-semibold text-gray-900">
            No maintenance records
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            There are no maintenance records available.
          </p>
        </div>
      ) : (
        /* ---------------------------------------------------------------- */
        /* Kitchen Folders */
        /* ---------------------------------------------------------------- */

        <div className="grid grid-cols-1 gap-4">
          {kitchens.map((kitchen) => {
            const isKitchenExpanded =
              !!expandedKitchens[kitchen._id];

            const serviceRecords = getCategoryRecords(
              kitchen.records,
              "service"
            );

            const visitorRecords = getCategoryRecords(
              kitchen.records,
              "visitor"
            );

            const purchaseRecords = getCategoryRecords(
              kitchen.records,
              "purchase"
            );

            return (
              <div
                key={kitchen._id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                {/* ====================================================== */}
                {/* Kitchen Folder */}
                {/* ====================================================== */}

                <button
                  type="button"
                  onClick={() =>
                    toggleKitchen(kitchen._id)
                  }
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-gray-50"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    {/* Folder Icon */}

                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
                        isKitchenExpanded
                          ? "bg-blue-100"
                          : "bg-yellow-100"
                      }`}
                    >
                      {isKitchenExpanded ? "📂" : "📁"}
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-base font-semibold text-gray-900">
                        {kitchen.name}
                      </h2>

                      <p className="mt-1 text-xs text-gray-500">
                        Kitchen ID: {kitchen._id}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {kitchen.records.length}{" "}
                      {kitchen.records.length === 1
                        ? "Record"
                        : "Records"}
                    </span>

                    <svg
                      className={`h-5 w-5 text-gray-500 transition-transform ${
                        isKitchenExpanded
                          ? "rotate-180"
                          : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* ====================================================== */}
                {/* Categories */}
                {/* ====================================================== */}

                {isKitchenExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 p-4">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">

                      {/* ------------------------------------------------ */}
                      {/* Service Category */}
                      {/* ------------------------------------------------ */}

                      <CategoryFolder
                        icon="🔧"
                        title="Service"
                        count={serviceRecords.length}
                        color="blue"
                        isExpanded={
                          !!expandedCategories[
                            `${kitchen._id}-service`
                          ]
                        }
                        onClick={() =>
                          toggleCategory(
                            kitchen._id,
                            "service"
                          )
                        }
                      />

                      {/* ------------------------------------------------ */}
                      {/* Visitor Category */}
                      {/* ------------------------------------------------ */}

                      <CategoryFolder
                        icon="👤"
                        title="Visitor"
                        count={visitorRecords.length}
                        color="orange"
                        isExpanded={
                          !!expandedCategories[
                            `${kitchen._id}-visitor`
                          ]
                        }
                        onClick={() =>
                          toggleCategory(
                            kitchen._id,
                            "visitor"
                          )
                        }
                      />

                      {/* ------------------------------------------------ */}
                      {/* Purchase Category */}
                      {/* ------------------------------------------------ */}

                      <CategoryFolder
                        icon="🛒"
                        title="Purchase Record"
                        count={purchaseRecords.length}
                        color="green"
                        isExpanded={
                          !!expandedCategories[
                            `${kitchen._id}-purchase`
                          ]
                        }
                        onClick={() =>
                          toggleCategory(
                            kitchen._id,
                            "purchase"
                          )
                        }
                      />
                    </div>

                    {/* ================================================== */}
                    {/* Category Data */}
                    {/* ================================================== */}

                    <div className="mt-4 space-y-4">
                      {/* Service Data */}

                      {expandedCategories[
                        `${kitchen._id}-service`
                      ] && (
                        <CategoryContent
                          title="Service Records"
                          icon="🔧"
                          records={serviceRecords}
                          type="service"
                          formatDate={formatDate}
                          getImageUrl={getImageUrl}
                        />
                      )}

                      {/* Visitor Data */}

                      {expandedCategories[
                        `${kitchen._id}-visitor`
                      ] && (
                        <CategoryContent
                          title="Visitor Records"
                          icon="👤"
                          records={visitorRecords}
                          type="visitor"
                          formatDate={formatDate}
                          getImageUrl={getImageUrl}
                        />
                      )}

                      {/* Purchase Data */}

                      {expandedCategories[
                        `${kitchen._id}-purchase`
                      ] && (
                        <CategoryContent
                          title="Purchase Records"
                          icon="🛒"
                          records={purchaseRecords}
                          type="purchase"
                          formatDate={formatDate}
                          getImageUrl={getImageUrl}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   CATEGORY FOLDER
========================================================================== */

const CategoryFolder = ({
  icon,
  title,
  count,
  color,
  isExpanded,
  onClick,
}) => {
  const colors = {
    blue: {
      border: "border-blue-200",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      text: "text-blue-700",
      badge: "bg-blue-100 text-blue-700",
    },

    orange: {
      border: "border-orange-200",
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      text: "text-orange-700",
      badge: "bg-orange-100 text-orange-700",
    },

    green: {
      border: "border-green-200",
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      text: "text-green-700",
      badge: "bg-green-100 text-green-700",
    },
  };

  const theme = colors[color];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between rounded-xl border p-4 text-left transition hover:shadow-sm ${theme.border} ${
        isExpanded ? theme.bg : "bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg text-lg ${theme.iconBg}`}
        >
          {isExpanded ? "📂" : icon}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            {title}
          </h3>

          <p className="mt-0.5 text-xs text-gray-500">
            {count} {count === 1 ? "record" : "records"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${theme.badge}`}
        >
          {count}
        </span>

        <svg
          className={`h-4 w-4 ${theme.text} transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </button>
  );
};

/* ==========================================================================
   CATEGORY CONTENT
========================================================================== */

const CategoryContent = ({
  title,
  icon,
  records,
  type,
  formatDate,
  getImageUrl,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>

          <h3 className="font-semibold text-gray-900">
            {title}
          </h3>
        </div>

        <span className="rounded-full bg-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700">
          {records.length}
        </span>
      </div>

      {/* No records */}

      {records.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-gray-500">
            No {title.toLowerCase()} available.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {records.map((record) => (
            <MaintenanceRecord
              key={record._id}
              record={record}
              type={type}
              formatDate={formatDate}
              getImageUrl={getImageUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   MAINTENANCE RECORD
========================================================================== */

const MaintenanceRecord = ({
  record,
  type,
  formatDate,
  getImageUrl,
}) => {
  const user = record?.userId;

  return (
    <div className="p-5">
      {/* User / Created */}

      <div className="mb-5 flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            User
          </p>

          <h3 className="mt-1 font-semibold text-gray-900">
            {user?.name || "Unknown User"}
          </h3>

          <p className="mt-1 break-all text-xs text-gray-500">
            ID: {user?._id || record?.userId}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs text-gray-400">
            Record Created
          </p>

          <p className="mt-1 text-sm font-medium text-gray-700">
            {formatDate(record?.createdAt)}
          </p>
        </div>
      </div>

      {/* ================================================================ */}
      {/* SERVICE */}
      {/* ================================================================ */}

      {type === "service" && record?.service && (
        <ServiceDetails
          service={record.service}
          formatDate={formatDate}
          getImageUrl={getImageUrl}
        />
      )}

      {/* ================================================================ */}
      {/* VISITOR */}
      {/* ================================================================ */}

      {type === "visitor" && record?.visitor && (
        <VisitorDetails
          visitor={record.visitor}
          formatDate={formatDate}
        />
      )}

      {/* ================================================================ */}
      {/* PURCHASE */}
      {/* ================================================================ */}

      {type === "purchase" && record?.purchaseRecord && (
        <PurchaseDetails
          purchase={record.purchaseRecord}
          formatDate={formatDate}
          getImageUrl={getImageUrl}
        />
      )}
    </div>
  );
};

/* ==========================================================================
   SERVICE DETAILS
========================================================================== */

const ServiceDetails = ({
  service,
  formatDate,
  getImageUrl,
}) => {
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Info
          label="Part Name"
          value={service.partName}
        />

        <Info
          label="Party Name"
          value={service.partyName}
        />

        <Info
          label="Service Date"
          value={formatDate(service.serviceDate)}
        />

        <Info
          label="Next Service"
          value={formatDate(service.nextServiceDate)}
        />
      </div>

      {service.narration && (
        <div className="mt-4">
          <Info
            label="Narration"
            value={service.narration}
          />
        </div>
      )}

      {/* Images */}

      {service.images?.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-gray-500">
            Service Images
          </p>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {service.images.map((image, index) => (
              <a
                key={`${image}-${index}`}
                href={getImageUrl(image)}
                target="_blank"
                rel="noreferrer"
                className="overflow-hidden rounded-lg"
              >
                <img
                  src={getImageUrl(image)}
                  alt={`Service ${index + 1}`}
                  className="h-28 w-full object-cover transition hover:scale-105"
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   VISITOR DETAILS
========================================================================== */

const VisitorDetails = ({
  visitor,
  formatDate,
}) => {
  return (
    <div className="rounded-lg border border-orange-100 bg-orange-50/50 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Info
          label="Visitor Name"
          value={visitor.visitorName}
        />

        <Info
          label="Phone Number"
          value={visitor.phoneNumber}
        />

        <Info
          label="Problem Date"
          value={formatDate(visitor.problemDate)}
        />

        <Info
          label="Reason"
          value={visitor.reason}
        />
      </div>

      {visitor.narration && (
        <div className="mt-4">
          <Info
            label="Narration"
            value={visitor.narration}
          />
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   PURCHASE DETAILS
========================================================================== */

const PurchaseDetails = ({
  purchase,
  formatDate,
  getImageUrl,
}) => {
  return (
    <div className="rounded-lg border border-green-100 bg-green-50/50 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Info
          label="Company"
          value={purchase.companyName}
        />

        <Info
          label="Party Name"
          value={purchase.partyName}
        />

        <Info
          label="Purchase Date"
          value={formatDate(purchase.purchaseDate)}
        />

        <Info
          label="Warranty"
          value={purchase.expiryWarrantyYear}
        />
      </div>

      {/* Guarantee Photo */}

      {purchase.guaranteePhoto && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-gray-500">
            Guarantee Document
          </p>

          <a
            href={getImageUrl(purchase.guaranteePhoto)}
            target="_blank"
            rel="noreferrer"
            className="inline-block overflow-hidden rounded-lg"
          >
            <img
              src={getImageUrl(purchase.guaranteePhoto)}
              alt="Guarantee"
              className="h-32 w-48 object-cover transition hover:scale-105"
            />
          </a>
        </div>
      )}

      {/* Other Images */}

      {purchase.otherImages?.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-gray-500">
            Other Images
          </p>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {purchase.otherImages.map(
              (image, index) => (
                <a
                  key={`${image}-${index}`}
                  href={getImageUrl(image)}
                  target="_blank"
                  rel="noreferrer"
                  className="overflow-hidden rounded-lg"
                >
                  <img
                    src={getImageUrl(image)}
                    alt={`Purchase ${index + 1}`}
                    className="h-28 w-full object-cover transition hover:scale-105"
                  />
                </a>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   INFO
========================================================================== */

const Info = ({ label, value }) => {
  return (
    <div>
      <p className="text-xs font-medium text-gray-400">
        {label}
      </p>

      <p className="mt-0.5 break-words text-sm text-gray-700">
        {value || "—"}
      </p>
    </div>
  );
};

export default Maintenance;
