import React, { useEffect, useMemo, useState } from "react";
import { getAllMaintenanceForAdmin } from "../../../services/maintainence.service";

const Maintenance = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [expandedKitchens, setExpandedKitchens] = useState({});

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllMaintenanceForAdmin()

     

      setMaintenance(response);
    } catch (error) {
      console.error(
        "Failed to fetch maintenance:",
        error
      );

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
  | Toggle kitchen
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
  | Format date
  |--------------------------------------------------------------------------
  */

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
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

    return `http://localhost:5000/api/v1/uploads/maintenance/${image}`;
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="p-6">
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
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="font-medium text-red-700">
            {error}
          </p>

          <button
            onClick={fetchMaintenance}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Maintenance
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View maintenance records kitchen-wise
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

      {/* Empty */}

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
        /*
         * One column grid
         */

        <div className="grid grid-cols-1 gap-4">
          {kitchens.map((kitchen) => {
            const isExpanded =
              !!expandedKitchens[kitchen._id];

            return (
              <div
                key={kitchen._id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                {/* Kitchen Header */}

                <button
                  type="button"
                  onClick={() =>
                    toggleKitchen(kitchen._id)
                  }
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-gray-50"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-lg">
                      🏠
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
                        isExpanded
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

                {/* Expanded Content */}

                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 p-4">
                    <div className="space-y-4">
                      {kitchen.records.map(
                        (record) => (
                          <MaintenanceRecord
                            key={record._id}
                            record={record}
                            formatDate={formatDate}
                            getImageUrl={getImageUrl}
                          />
                        )
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

const MaintenanceRecord = ({
  record,
  formatDate,
  getImageUrl,
}) => {
  const user = record?.userId;
  const service = record?.service;
  const visitor = record?.visitor;
  const purchase = record?.purchaseRecord;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* User */}

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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Service */}

        {service && (
          <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                🔧
              </div>

              <h4 className="font-semibold text-gray-900">
                Service
              </h4>
            </div>

            <div className="space-y-3">
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
                value={formatDate(
                  service.serviceDate
                )}
              />

              <Info
                label="Next Service"
                value={formatDate(
                  service.nextServiceDate
                )}
              />

              {service.narration && (
                <Info
                  label="Narration"
                  value={service.narration}
                />
              )}
            </div>

            {/* Service Images */}

            {service.images?.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {service.images.map(
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
                        alt={`Service ${index + 1}`}
                        className="h-28 w-full object-cover transition hover:scale-105"
                      />
                    </a>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* Visitor */}

        {visitor && (
          <div className="rounded-lg border border-orange-100 bg-orange-50/50 p-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100">
                👤
              </div>

              <h4 className="font-semibold text-gray-900">
                Visitor
              </h4>
            </div>

            <div className="space-y-3">
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
                value={formatDate(
                  visitor.problemDate
                )}
              />

              <Info
                label="Reason"
                value={visitor.reason}
              />

              {visitor.narration && (
                <Info
                  label="Narration"
                  value={visitor.narration}
                />
              )}
            </div>
          </div>
        )}

        {/* Purchase */}

        {purchase && (
          <div className="rounded-lg border border-green-100 bg-green-50/50 p-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                🛒
              </div>

              <h4 className="font-semibold text-gray-900">
                Purchase Record
              </h4>
            </div>

            <div className="space-y-3">
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
                value={formatDate(
                  purchase.purchaseDate
                )}
              />

              <Info
                label="Warranty"
                value={
                  purchase.expiryWarrantyYear
                }
              />
            </div>

            {/* Guarantee Photo */}

            {purchase.guaranteePhoto && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-gray-500">
                  Guarantee Document
                </p>

                <a
                  href={getImageUrl(
                    purchase.guaranteePhoto
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={getImageUrl(
                      purchase.guaranteePhoto
                    )}
                    alt="Guarantee"
                    className="h-28 w-full rounded-lg object-cover"
                  />
                </a>
              </div>
            )}

            {/* Other Images */}

            {purchase.otherImages?.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                {purchase.otherImages.map(
                  (image, index) => (
                    <a
                      key={`${image}-${index}`}
                      href={getImageUrl(image)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`Purchase ${index + 1}`}
                        className="h-24 w-full rounded-lg object-cover"
                      />
                    </a>
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* No details */}

      {!service && !visitor && !purchase && (
        <div className="rounded-lg bg-gray-50 p-5 text-center text-sm text-gray-500">
          No maintenance details available.
        </div>
      )}
    </div>
  );
};

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
