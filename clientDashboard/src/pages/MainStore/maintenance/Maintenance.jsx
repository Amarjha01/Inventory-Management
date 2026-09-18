import React, { useEffect, useMemo, useState } from "react";
import {
  FiMenu,
  FiSearch,
  FiFilter,
  FiPlus,
  FiTool,
  FiUsers,
  FiShoppingBag,
} from "react-icons/fi";

import MaintenanceSideBar from "./MaintenanceSideBar";
import kitchens from "../../../constants/kitchen.js";
import { getAllMaintenanceForAdmin } from "../.../../../../services/maintainence.service.js"

const EmptyRecordState = ({ type }) => {
  const config = {
    service: {
      title: "No Service Records",
      hindi: "कोई सर्विस रिकॉर्ड नहीं मिला",
      icon: FiTool,
    },
    visitor: {
      title: "No Visitor Records",
      hindi: "कोई विजिटर रिकॉर्ड नहीं मिला",
      icon: FiUsers,
    },
    purchaseRecord: {
      title: "No Purchase Records",
      hindi: "कोई परचेज रिकॉर्ड नहीं मिला",
      icon: FiShoppingBag,
    },
  };

  const current = config[type] || config.service;
  const Icon = current.icon;

  return (
    <div className="flex py-5 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
        <Icon
          size={24}
          className="text-slate-400"
        />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-700">
        {current.title}
      </h3>

      <p className="mt-1 text-xs text-slate-400">
        {current.hindi}
      </p>

      <p className="mt-3 max-w-sm text-xs text-slate-400">
        There are no records available for this kitchen.
      </p>
    </div>
  );
};
const RECORD_TYPES = {
  SERVICE: "service",
  VISITOR: "visitor",
  PURCHASERECORD: "purchaseRecord",
};

const Maintenance = () => {
  const [selectedKitchen, setSelectedKitchen] = useState(null);
  const [selectedType, setSelectedType] = useState(
    RECORD_TYPES.SERVICE
  );

  const [maintenanceData, setMaintenanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --------------------------------------------------
  // GET ALL MAINTENANCE DATA
  // --------------------------------------------------

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAllMaintenanceForAdmin();

        /*
         * If your API returns:
         *
         * { data: [...] }
         *
         * this handles it.
         *
         * If your service already returns the array,
         * it also handles that.
         */
        const data = Array.isArray(response)
          ? response
          : response?.data || [];

        setMaintenanceData(data);
      } catch (err) {
        console.error(
          "Failed to fetch maintenance records:",
          err
        );

        setError(
          "Failed to load maintenance records."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenance();
  }, []);

  // --------------------------------------------------
  // SELECT FIRST KITCHEN BY DEFAULT
  // --------------------------------------------------

  useEffect(() => {
    if (
      !selectedKitchen &&
      kitchens?.length > 0
    ) {
      setSelectedKitchen(kitchens[0]);
    }
  }, [selectedKitchen]);

  // --------------------------------------------------
  // GET SELECTED KITCHEN RECORDS
  // --------------------------------------------------

const filteredRecords = useMemo(() => {
  if (!selectedKitchen) return [];

  const kitchenId = selectedKitchen._id;


  return maintenanceData
    .filter((record) => {
      const recordKitchenId =
        record.kitchenId?._id ||
        record.kitchenId;

      return (
        String(recordKitchenId) ===
        String(kitchenId)
      );
    })
    .filter((record) => {
      if (selectedType === RECORD_TYPES.SERVICE) {
        return !!record.service;
      }

      if (selectedType === RECORD_TYPES.VISITOR) {
        return !!record.visitor;
      }

      if (selectedType === RECORD_TYPES.PURCHASERECORD) {
        return !!record.purchaseRecord;
      }

      return false;
    });
}, [
  maintenanceData,
  selectedKitchen,
  selectedType,
]);

  // --------------------------------------------------
  // TYPE DETAILS
  // --------------------------------------------------

  const typeDetails = useMemo(() => {
    switch (selectedType) {
      case RECORD_TYPES.SERVICE:
        return {
          title: "Service Records",
          hindi: "सर्विस रिकॉर्ड",
          icon: FiTool,
        };

      case RECORD_TYPES.VISITOR:
        return {
          title: "Visitor Records",
          hindi: "विजिटर रिकॉर्ड",
          icon: FiUsers,
        };

      case RECORD_TYPES.PURCHASERECORD:
        return {
          title: "Purchase Records",
          hindi: "परचेज रिकॉर्ड",
          icon: FiShoppingBag,
        };

      default:
        return {
          title: "Records",
          hindi: "रिकॉर्ड",
          icon: FiTool,
        };
    }
  }, [selectedType]);

  const TypeIcon = typeDetails.icon;

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="max-h-112.5">

      <div className="flex">

        {/* =========================================
            DESKTOP SIDEBAR
        ========================================= */}

        <div className="hidden lg:block ">
          <MaintenanceSideBar
            kitchens={kitchens}
            selectedKitchen={selectedKitchen}
            selectedType={selectedType}
            onKitchenSelect={setSelectedKitchen}
            onTypeSelect={setSelectedType}
          />
        </div>

        {/* =========================================
            MAIN CONTENT
        ========================================= */}

        <main className="min-w-0 flex-1 lg:max-h-[450px]">

          {/* Mobile Header */}
          <div className="sticky top-20 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden">

            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 hover:bg-slate-100"
            >
              <FiMenu size={21} />
            </button>

            <div>
              <p className="text-sm font-bold">
                Maintenance
              </p>

              <p className="text-[11px] text-slate-400">
                मेंटेनेंस
              </p>
            </div>

          </div>

          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

            {/* =====================================
                LOADING
            ===================================== */}

            {loading && (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-sm text-slate-400">
                  Loading maintenance records...
                </div>
              </div>
            )}

            {/* =====================================
                ERROR
            ===================================== */}

            {!loading && error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* =====================================
                CONTENT
            ===================================== */}

            {!loading && !error && selectedKitchen && (
              <>
                {/* Header */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                      <TypeIcon
                        size={21}
                        className="text-slate-700"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        {selectedKitchen.name}
                      </p>

                      <h1 className="text-xl font-bold text-slate-900">
                        {typeDetails.title}
                      </h1>

                      <p className="text-xs text-slate-400">
                        {typeDetails.hindi}
                      </p>
                    </div>

                  </div>

                  {/* <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    <FiPlus size={17} />
                    Add Record
                  </button> */}

                </div>

                {/* Search */}
                {/* <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-3">

                  <div className="flex flex-col gap-3 sm:flex-row">

                    <div className="relative flex-1">

                      <FiSearch
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        size={17}
                      />

                      <input
                        value={search}
                        onChange={(e) =>
                          setSearch(e.target.value)
                        }
                        placeholder="Search records / रिकॉर्ड खोजें..."
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-slate-400 focus:bg-white"
                      />

                    </div>

                    <button
                      type="button"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                      <FiFilter size={16} />
                      Filter
                    </button>

                  </div>

                </div> */}

                {/* Record Count */}
                <div className="mb-3">
                  <p className="text-sm text-slate-500">
                    {filteredRecords.length}{" "}
                    {filteredRecords.length === 1
                      ? "record"
                      : "records"}
                  </p>
                </div>

                {/* Records */}
                {filteredRecords.length > 0 ? (
                  <div className="space-y-4 lg:max-h-75 lg:overflow-y-scroll grid md:grid-cols-2 lg:grid-cols-3">

                    {filteredRecords.map(
                      (record) => (
                        <MaintenanceRecordCard
                          key={record._id}
                          record={record}
                          type={selectedType}
                        />
                      )
                    )}

                  </div>
                ) : (
                  <EmptyRecordState
                    type={selectedType}
                  />
                )}
              </>
            )}

          </div>
        </main>
      </div>

      {/* ===========================================
          MOBILE SIDEBAR
      =========================================== */}

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

          <div className="relative">
            <MaintenanceSideBar
              kitchens={kitchens}
              selectedKitchen={selectedKitchen}
              selectedType={selectedType}
              onKitchenSelect={setSelectedKitchen}
              onTypeSelect={(type) => {
                setSelectedType(type);
                setSidebarOpen(false);
              }}
            />
          </div>

        </div>
      )}

    </div>
  );
};
const MaintenanceRecordCard = ({
  record,
  type,
}) => {
  if (type === "service") {
    return (
      <ServiceRecordCard
        record={record.service}
      />
    );
  }

  if (type === "visitor") {
    return (
      <VisitorRecordCard
        record={record.visitor}
      />
    );
  }

  if (type === "purchaseRecord") {
    return (
      <PurchaseRecordCard
        record={record.purchaseRecord}
      />
    );
  }

  return null;
};

const VisitorRecordCard = ({ record }) => {
  if (!record) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between ">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            {record.visitorName || "Unknown Visitor"}
          </h3>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          Visitor
        </span>
      </div>

      {/* Details */}
      <div className=" grid grid-cols-3 gap-3 sm:grid-cols-3">
        <Info
          label="Problem Date"
          value={new Date(record.problemDate).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          // timeStyle: "medium",
                          timeZone: "Asia/Kolkata",
                        })}
          
        />

        <Info
          label="Phone Number"
          value={record.phoneNumber}
        />

        <Info
          label="Reason"
          value={record.reason}
        />
      </div>

      {/* Narration */}
      {record.narration && (
        <div className="mt-4 rounded-xl bg-slate-50 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Narration
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            {record.narration}
          </p>
        </div>
      )}

      {/* Other Photos */}
      {record.otherPhotos?.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Other Photos
          </p>

          <div className="flex flex-wrap gap-2">
            {record.otherPhotos.map((photo, index) => (
              <img
                key={photo?._id || index}
                src={photo?.url || photo}
                alt={`Other ${index + 1}`}
                className="h-20 w-20 rounded-xl object-cover ring-1 ring-slate-200"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PurchaseRecordCard = ({ record }) => {
  if (!record) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            {record.companyName || "Purchase Record"}
          </h3>

          <p className="mt-0.5 text-xs text-slate-400">
            परचेज रिकॉर्ड
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          Purchase
        </span>
      </div>

      {/* Details */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Info
          label="Purchase Date"
          value={record.purchaseDate}
        />

        <Info
          label="Party Name"
          value={record.partyName}
        />

        <Info
          label="Company Name"
          value={record.companyName}
        />

        <Info
          label="Warranty / Expiry"
          value={record.expiryWarrantyYear}
        />
      </div>

      {/* Photos */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* Guarantee / Warranty Photo */}
        {record.guaranteePhoto && (
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Guarantee / Warranty
            </p>

            <img
              src={
                record.guaranteePhoto?.url ||
                record.guaranteePhoto
              }
              alt="Guarantee / Warranty"
              className="h-32 w-full rounded-xl object-cover ring-1 ring-slate-200"
            />
          </div>
        )}

        {/* Other Images */}
        {record.otherImages?.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Other Photos
            </p>

            <div className="flex flex-wrap gap-2">
              {record.otherImages.map(
                (photo, index) => (
                  <img
                    key={photo?._id || index}
                    src={photo?.url || photo}
                    alt={`Other ${index + 1}`}
                    className="h-20 w-20 rounded-xl object-cover ring-1 ring-slate-200"
                  />
                )
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const ServiceRecordCard = ({ record }) => {
  if (!record) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-slate-900">
            {record.partName || "Service Record"}
          </h3>

          <p className="text-[11px] text-slate-400">
            Service / सर्विस
          </p>
        </div>

        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
          Service
        </span>
      </div>

      {/* Details */}
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">

       <Info
  label="Service Date"
  value={
    record.serviceDate
      ? new Date(record.serviceDate).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeZone: "Asia/Kolkata",
        })
      : "-"
  }
/>

<Info
  label="Next Service"
  value={
    record.nextServiceDate
      ? new Date(record.nextServiceDate).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeZone: "Asia/Kolkata",
        })
      : "-"
  }
/>

        <Info
          label="Party"
          value={record.partyName}
        />

      </div>

      {/* Narration */}
      {record.narration && (
        <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2">
          <p className="line-clamp-2 text-xs text-slate-600">
            {record.narration}
          </p>
        </div>
      )}

      {/* Images */}
      {record.images?.length > 0 && (
        <div className="mt-3 flex gap-2">
          {record.images.map((photo, index) => (
            <img
              key={photo?._id || index}
              src={photo?.url || photo}
              alt={`Service ${index + 1}`}
              className="h-14 w-14 rounded-lg object-cover ring-1 ring-slate-200"
            />
          ))}
        </div>
      )}

    </div>
  );
};

const Info = ({ label, value }) => {
  return (
    <div className="rounded-xl bg-slate-50  p-1">
      <p className="text-[7px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 wrap-break-word text-[10px] font-semibold text-slate-700">
        {value || "-"}
      </p>
    </div>
  );
};



export default Maintenance;