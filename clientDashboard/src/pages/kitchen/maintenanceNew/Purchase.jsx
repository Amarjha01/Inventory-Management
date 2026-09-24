import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  FiCalendar,
  FiChevronDown,
  FiFilter,
  FiPackage,
  FiRefreshCw,
  FiSearch,
  FiX,
} from "react-icons/fi";

import MaintenanceDetailModal from "../../../components/mainStore/maintenance/MaintenanceDetailModal.jsx";

import { createPurchaseRecord, getAllPurchaseForKitchen } from "../../../services/maintainence.service.js";
import PurchaseCard from "../../../components/mainStore/maintenance/PurchaseCard.jsx";
import { AnimatePresence } from "framer-motion";
import CameraCapture from "../../../components/kitchen/uploads/CameraCapture.jsx";
import PurchaseSection from "./PurchaseSection.jsx";
import toast from "react-hot-toast";

/* =========================================================
   HELPERS
========================================================= */

const getId = (value) => {
  if (!value) return null;

  if (typeof value === "string") {
    return value;
  }

  return value._id || value.id || null;
};

const getKitchenName = (record) => {
  if (!record) return "Unknown Kitchen";

  if (record.kitchenId && typeof record.kitchenId === "object") {
    return (
      record.kitchenId?.name ||
      record.kitchenId?.kitchenName ||
      "Unknown Kitchen"
    );
  }

  if (record.kitchen?.name) {
    return record.kitchen.name;
  }

  if (record.kitchenName) {
    return record.kitchenName;
  }

  return "Unknown Kitchen";
};

/* =========================================================
   NORMALIZE PURCHASE RECORD
========================================================= */

const normalizePurchaseRecord = (record) => {
  if (!record) return null;
  console.log(record);

  return {
    ...record,

    kitchenName: getKitchenName(record),

    purchaseDate: record?.purchaseRecord.purchaseDate || record?.date || null,

    partyName: record.purchaseRecord.partyName || "",

    companyName: record.purchaseRecord.companyName || "",

    expiryWarrantyYear: record.purchaseRecord.expiryWarrantyYear || "",

    guarantyPhoto: record.purchaseRecord.guarantyPhoto || null,

    otherImage: record.purchaseRecord.otherImage || null,
  };
};

const EMPTY_PURCHASE = {
  purchaseDate: "",
  ReceivedDate: "",
  partName: "",
  partyName: "",
  companyName: "",
  guaranteeWarrantyType: "",
  guaranteePhoto: null,
  guaranteeWarrantyDuration: "",
  guaranteeWarrantyUnit: "",
  expiryWarrantyYear: "",
  otherImages: [],
};

/* =========================================================
   COMPONENT
========================================================= */

const Purchase = () => {
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [success, setSuccess] = useState("");

  const [showCamera, setShowCamera] = useState(false);

  const [cameraType, setCameraType] = useState(null);
  const [purchaseForm, setPurchaseForm] = useState(EMPTY_PURCHASE);

  const closeForm = () => {
    setShowForm(false);
  };
  const openCamera = (type) => {
    setCameraType(type);

    setShowCamera(true);
  };

  const handleCameraCapture = (file, documentType) => {
    if (!file) return;

    if (documentType?.id === "service-image") {
      setServiceForm((previous) => {
        if (previous.images.length >= 5) {
          return previous;
        }

        return {
          ...previous,
          images: [...previous.images, file],
        };
      });

      return;
    }

    if (documentType?.id === "visitor-image") {
      setVisitorForm((previous) => {
        if (previous.otherImages.length >= 3) {
          return previous;
        }

        return {
          ...previous,
          otherImages: [...previous.otherImages, file],
        };
      });

      return;
    }

    if (documentType?.id === "guarantee-photo") {
      setPurchaseForm((previous) => ({
        ...previous,
        guaranteePhoto: file,
      }));

      return;
    }

    if (documentType?.id === "purchase-image") {
      setPurchaseForm((previous) => {
        if (previous.otherImages.length >= 5) {
          return previous;
        }

        return {
          ...previous,
          otherImages: [...previous.otherImages, file],
        };
      });
    }
  };

  const handlePurchaseChange = (event) => {
    const { name, value } = event.target;
    console.log("name ", name, "value", value);

    setPurchaseForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleGuaranteeFile = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setPurchaseForm((previous) => ({
      ...previous,
      guaranteePhoto: file,
    }));

    event.target.value = "";
  };

  const handlePurchaseFiles = (event) => {
    console.log(event.target.files);

    const files = Array.from(event.target.files || []);

    if (!files) return;

    setPurchaseForm((previous) => ({
      ...previous,

      otherImages: [...previous.otherImages, ...files].slice(0, 5),
    }));

    event.target.value = "";
  };

  const removeGuaranteePhoto = () => {
    setPurchaseForm((previous) => ({
      ...previous,
      guaranteePhoto: null,
    }));
  };

  const removePurchaseImage = (index) => {
    setPurchaseForm((previous) => ({
      ...previous,
      otherImages: previous.otherImages.filter(
        (_, imageIndex) => imageIndex !== index,
      ),
    }));
  };

  const validatePurchase = () => {
    if (!purchaseForm.purchaseDate) {
      return "Purchase date is required.";
    }

    if (!purchaseForm.partyName.trim()) {
      return "Party name is required.";
    }

    if (!purchaseForm.companyName.trim()) {
      return "Company name is required.";
    }

    return "";
  };

  const buildPurchaseFormData = () => {
    const formData = new FormData();

    formData.append("purchaseDate", purchaseForm.purchaseDate);
    formData.append("partName", purchaseForm.partName);
    formData.append("ReceivedDate", purchaseForm.ReceivedDate);
    formData.append("partyName", purchaseForm.partyName);
    formData.append("companyName", purchaseForm.companyName);
    formData.append(
      "guaranteeWarrantyType",
      purchaseForm.guaranteeWarrantyType,
    );
    formData.append(
      "expiryWarrantyYear",
      `${purchaseForm.guaranteeWarrantyDuration} ${purchaseForm.guaranteeWarrantyUnit}`,
    );

    if (purchaseForm.guaranteePhoto instanceof File) {
      formData.append("guaranteePhoto", purchaseForm.guaranteePhoto);
    }

    purchaseForm.otherImages.forEach((image) => {
      if (image instanceof File) {
        formData.append("otherImages", image);
      }
    });

    return formData;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");


   
   let validationError = validatePurchase();


    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);

      let formData = buildPurchaseFormData();
      let response;

        try {
          response = await createPurchaseRecord(formData);
          toast.success("New Purchase Record Created successfully")
        } catch (error) {
          toast.error(error)
          console.error(error);
        }

      closeForm();
    } catch (error) {
                console.error(error);
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const cameraDocument = useMemo(() => {
    if (cameraType === "guarantee-photo") {
      return {
        id: "guarantee-photo",
        title: "Guarantee / Warranty",
      };
    }
    return {
      id: "purchase-image",
      title: "Purchase Image",
    };
  }, [cameraType]);
  /* =======================================================
     DATA
  ======================================================= */

  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  /* =======================================================
     SEARCH
  ======================================================= */

  const [search, setSearch] = useState("");

  /* =======================================================
     FILTERS
  ======================================================= */

  const [showFilters, setShowFilters] = useState(false);

  const [selectedKitchen, setSelectedKitchen] = useState("ALL");

  const [dateFrom, setDateFrom] = useState("");

  const [dateTo, setDateTo] = useState("");

  /*
   * Warranty filter:
   *
   * ALL
   * ACTIVE
   * EXPIRED
   */

  const [warrantyFilter, setWarrantyFilter] = useState("ALL");

  /* =======================================================
     SELECTED RECORD
  ======================================================= */

  const [selectedRecord, setSelectedRecord] = useState(null);

  /* =======================================================
     FETCH PURCHASE RECORDS
  ======================================================= */

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllPurchaseForKitchen();

      console.log("PURCHASE RECORDS RESPONSE:", response);

      let data = response;

      if (response?.data && Array.isArray(response.data)) {
        data = response.data;
      }

      if (!Array.isArray(data)) {
        data = [];
      }

      const normalized = data.map(normalizePurchaseRecord).filter(Boolean);

      setRecords(normalized);
    } catch (err) {
      console.error("Failed to fetch purchase records:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load purchase records.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* =======================================================
     INITIAL FETCH
  ======================================================= */

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  /* =======================================================
     KITCHEN OPTIONS
  ======================================================= */

  const kitchens = useMemo(() => {
    const map = new Map();

    records.forEach((record) => {
      const kitchenId = getId(record.kitchenId);

      const kitchenName = record.kitchenName || getKitchenName(record);

      if (kitchenId) {
        map.set(kitchenId, {
          id: kitchenId,
          name: kitchenName,
        });
      } else if (kitchenName !== "Unknown Kitchen") {
        map.set(kitchenName, {
          id: kitchenName,
          name: kitchenName,
        });
      }
    });

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [records]);

  /* =======================================================
     WARRANTY STATUS
  ======================================================= */

  const getWarrantyStatus = (record) => {
    if (!record.expiryWarrantyYear) {
      return "UNKNOWN";
    }

    /*
     * expiryWarrantyYear can be:
     *
     * 2026
     * "2026"
     */

    const expiryYear = Number(record.expiryWarrantyYear);

    if (Number.isNaN(expiryYear)) {
      return "UNKNOWN";
    }

    const currentYear = new Date().getFullYear();

    if (expiryYear >= currentYear) {
      return "ACTIVE";
    }

    return "EXPIRED";
  };

  /* =======================================================
     FILTERED RECORDS
  ======================================================= */

  const filteredRecords = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return records.filter((record) => {
      /* -----------------------------------------------
           SEARCH
        ----------------------------------------------- */

      if (normalizedSearch) {
        const searchableText = [
          record.purchaseRecord.partyName,

          record.purchaseRecord.companyName,

          record.kitchenName,

          record.kitchenId?.name,

          record.expiryWarrantyYear,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(normalizedSearch)) {
          return false;
        }
      }

      /* -----------------------------------------------
           KITCHEN
        ----------------------------------------------- */

      if (selectedKitchen !== "ALL") {
        const recordKitchenId = getId(record.kitchenId);

        const recordKitchenName = record.kitchenName || getKitchenName(record);

        if (
          recordKitchenId !== selectedKitchen &&
          recordKitchenName !== selectedKitchen
        ) {
          return false;
        }
      }

      /* -----------------------------------------------
           PURCHASE DATE FROM
        ----------------------------------------------- */

      if (dateFrom && record.purchaseRecord.purchaseDate) {
        const purchaseDate = new Date(record.purchaseRecord.purchaseDate);

        const fromDate = new Date(`${dateFrom}T00:00:00`);

        if (purchaseDate < fromDate) {
          return false;
        }
      }

      /* -----------------------------------------------
           PURCHASE DATE TO
        ----------------------------------------------- */

      if (dateTo && record.purchaseRecord.purchaseDate) {
        const purchaseDate = new Date(record.purchaseRecord.purchaseDate);

        const toDate = new Date(`${dateTo}T23:59:59`);

        if (purchaseDate > toDate) {
          return false;
        }
      }

      /* -----------------------------------------------
           WARRANTY
        ----------------------------------------------- */

      if (warrantyFilter !== "ALL") {
        const warrantyStatus = getWarrantyStatus(record);

        if (warrantyStatus !== warrantyFilter) {
          return false;
        }
      }

      return true;
    });
  }, [records, search, selectedKitchen, dateFrom, dateTo, warrantyFilter]);

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {
    setSearch("");

    setSelectedKitchen("ALL");

    setDateFrom("");

    setDateTo("");

    setWarrantyFilter("ALL");
  };

  const hasActiveFilters =
    selectedKitchen !== "ALL" ||
    warrantyFilter !== "ALL" ||
    dateFrom ||
    dateTo ||
    search;

  /* =======================================================
     RECORD CLICK
  ======================================================= */

  const handleRecordClick = (record) => {
    setSelectedRecord(record);
  };

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const handleCloseModal = () => {
    setSelectedRecord(null);
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        {/* Toolbar skeleton */}

        <div
          className="
            mb-6
            animate-pulse
          "
        >
          <div
            className="
              h-11
              rounded-xl
              bg-slate-200
            "
          />
        </div>

        {/* Card skeleton */}

        <div
          className="
            grid
            gap-4
            sm:grid-cols-2
            xl:grid-cols-3
          "
        >
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="
                  h-52
                  animate-pulse
                  rounded-2xl
                  border
                  border-slate-200
                  bg-white
                "
            />
          ))}
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <div
        className="
          flex
          min-h-[400px]
          items-center
          justify-center
          p-6
        "
      >
        <div
          className="
            w-full
            max-w-md
            rounded-2xl
            border
            border-red-100
            bg-white
            p-6
            text-center
            shadow-sm
          "
        >
          <div
            className="
              mx-auto
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-red-50
            "
          >
            <FiPackage size={20} className="text-red-500" />
          </div>

          <h2
            className="
              mt-4
              text-sm
              font-bold
              text-slate-900
            "
          >
            Unable to load purchase records
          </h2>

          <p
            className="
              mt-2
              text-xs
              leading-5
              text-slate-500
            "
          >
            {error}
          </p>

          <button
            type="button"
            onClick={fetchRecords}
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-slate-900
              px-4
              py-2.5
              text-xs
              font-semibold
              text-white
              transition
              hover:bg-slate-800
            "
          >
            <FiRefreshCw size={14} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <>
      <div className="p-4 sm:p-6">
        {/* =================================================
            TOOLBAR
        ================================================= */}

        <div className="mb-5">
          <div
            className="
              flex
              gap-3
            "
          >
            {/* SEARCH */}

            <div
              className="
                relative
                flex-1
              "
            >
              <FiSearch
                size={17}
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="
                  Search purchase records...
                "
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  pl-11
                  pr-10
                  text-sm
                  text-slate-900
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-slate-400
                  focus:ring-2
                  focus:ring-slate-100
                "
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    rounded-full
                    p-1
                    text-slate-400
                    hover:bg-slate-100
                    hover:text-slate-700
                  "
                >
                  <FiX size={15} />
                </button>
              )}
            </div>

            {/* FILTER */}

            <button
              type="button"
              onClick={() => setShowFilters((previous) => !previous)}
              className={`
                inline-flex
                h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                px-4
                text-xs
                font-semibold
                transition

                ${
                  showFilters || hasActiveFilters
                    ? `
                      border-slate-900
                      bg-slate-900
                      text-white
                    `
                    : `
                      border-slate-200
                      bg-white
                      text-slate-600
                      hover:border-slate-300
                      hover:text-slate-900
                    `
                }
              `}
            >
              <FiFilter size={15} />
              Filter
              {hasActiveFilters && (
                <span
                  className={`
                    flex
                    h-5
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    px-1.5
                    text-[10px]

                    ${
                      showFilters
                        ? `
                          bg-white
                          text-slate-900
                        `
                        : `
                          bg-slate-900
                          text-white
                        `
                    }
                  `}
                >
                  !
                </span>
              )}
            </button>

            {/* REFRESH */}

            <button
              type="button"
              onClick={fetchRecords}
              title="Refresh"
              className="
                inline-flex
                h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                text-xs
                font-semibold
                text-slate-600
                transition
                hover:border-slate-300
                hover:text-slate-900
              "
            >
              <FiRefreshCw size={15} />

              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="hidden md:block px-3 py-1 bg-black cursor-pointer text-white "
            >
              Create New Purchase +
            </button>
          </div>

          {/* =================================================
              FILTER PANEL
          ================================================= */}

          {showFilters && (
            <div
              className="
                mt-3
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
              "
            >
              <div
                className="
                  grid
                  gap-4
                  sm:grid-cols-2
                  xl:grid-cols-4
                "
              >
                {/* KITCHEN */}

                <div>
                  <label
                    htmlFor="
                      purchase-kitchen-filter
                    "
                    className="
                      mb-1.5
                      block
                      text-[11px]
                      font-semibold
                      text-slate-500
                    "
                  >
                    Kitchen
                  </label>

                  <div className="relative">
                    <select
                      id="
                        purchase-kitchen-filter
                      "
                      value={selectedKitchen}
                      onChange={(event) =>
                        setSelectedKitchen(event.target.value)
                      }
                      className="
                        h-10
                        w-full
                        appearance-none
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-3
                        pr-9
                        text-xs
                        text-slate-700
                        outline-none
                        focus:border-slate-400
                      "
                    >
                      <option value="ALL">All Kitchens</option>

                      {kitchens.map((kitchen) => (
                        <option key={kitchen.id} value={kitchen.id}>
                          {kitchen.name}
                        </option>
                      ))}
                    </select>

                    <FiChevronDown
                      size={14}
                      className="
                        pointer-events-none
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />
                  </div>
                </div>

                {/* WARRANTY */}

                <div>
                  <label
                    htmlFor="
                      purchase-warranty-filter
                    "
                    className="
                      mb-1.5
                      block
                      text-[11px]
                      font-semibold
                      text-slate-500
                    "
                  >
                    Warranty
                  </label>

                  <div className="relative">
                    <select
                      id="
                        purchase-warranty-filter
                      "
                      value={warrantyFilter}
                      onChange={(event) =>
                        setWarrantyFilter(event.target.value)
                      }
                      className="
                        h-10
                        w-full
                        appearance-none
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-3
                        pr-9
                        text-xs
                        text-slate-700
                        outline-none
                        focus:border-slate-400
                      "
                    >
                      <option value="ALL">All Warranty</option>

                      <option value="ACTIVE">Active</option>

                      <option value="EXPIRED">Expired</option>
                    </select>

                    <FiChevronDown
                      size={14}
                      className="
                        pointer-events-none
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />
                  </div>
                </div>

                {/* DATE FROM */}

                <div>
                  <label
                    htmlFor="
                      purchase-date-from
                    "
                    className="
                      mb-1.5
                      block
                      text-[11px]
                      font-semibold
                      text-slate-500
                    "
                  >
                    Purchase Date From
                  </label>

                  <div className="relative">
                    <FiCalendar
                      size={14}
                      className="
                        pointer-events-none
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      id="
                        purchase-date-from
                      "
                      type="date"
                      value={dateFrom}
                      onChange={(event) => setDateFrom(event.target.value)}
                      className="
                        h-10
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-3
                        pl-9
                        text-xs
                        text-slate-700
                        outline-none
                        focus:border-slate-400
                      "
                    />
                  </div>
                </div>

                {/* DATE TO */}

                <div>
                  <label
                    htmlFor="
                      purchase-date-to
                    "
                    className="
                      mb-1.5
                      block
                      text-[11px]
                      font-semibold
                      text-slate-500
                    "
                  >
                    Purchase Date To
                  </label>

                  <div className="relative">
                    <FiCalendar
                      size={14}
                      className="
                        pointer-events-none
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                      "
                    />

                    <input
                      id="
                        purchase-date-to
                      "
                      type="date"
                      value={dateTo}
                      onChange={(event) => setDateTo(event.target.value)}
                      className="
                        h-10
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-3
                        pl-9
                        text-xs
                        text-slate-700
                        outline-none
                        focus:border-slate-400
                      "
                    />
                  </div>
                </div>
              </div>

              {/* CLEAR */}

              {hasActiveFilters && (
                <div
                  className="
                    mt-4
                    flex
                    justify-end
                  "
                >
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      text-xs
                      font-semibold
                      text-slate-500
                      hover:text-slate-900
                    "
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowForm(true)}
          className=" w-full md:hidden px-3 py-1 mb-3 bg-black cursor-pointer text-white "
        >
          Create New Purchase +
        </button>
        {/* =================================================
            RESULT HEADER
        ================================================= */}

        <div
          className="
            mb-4
            flex
            items-center
            justify-between
          "
        >
          <div>
            <h2
              className="
                text-sm
                font-bold
                text-slate-900
              "
            >
              Purchase Records
            </h2>

            <p
              className="
                mt-0.5
                text-[11px]
                text-slate-400
              "
            >
              {filteredRecords.length}{" "}
              {filteredRecords.length === 1 ? "record" : "records"}
            </p>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="
                text-[11px]
                font-semibold
                text-slate-500
                hover:text-slate-900
              "
            >
              Clear filters
            </button>
          )}
        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {filteredRecords.length === 0 ? (
          <div
            className="
              flex
              min-h-[360px]
              items-center
              justify-center
              rounded-2xl
              border
              border-dashed
              border-slate-200
              bg-white
            "
          >
            <div
              className="
                px-6
                text-center
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-slate-100
                "
              >
                <FiPackage size={22} className="text-slate-400" />
              </div>

              <h3
                className="
                  mt-4
                  text-sm
                  font-bold
                  text-slate-900
                "
              >
                No purchase records found
              </h3>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-sm
                  text-xs
                  leading-5
                  text-slate-400
                "
              >
                {hasActiveFilters
                  ? "Try changing your search or filters."
                  : "There are no purchase records available yet."}
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="
                    mt-4
                    rounded-xl
                    bg-slate-900
                    px-4
                    py-2.5
                    text-xs
                    font-semibold
                    text-white
                    hover:bg-slate-800
                  "
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          /* =================================================
             RECORD GRID
          ================================================= */

          <div
            className="
              grid
              gap-4
              sm:grid-cols-2
              xl:grid-cols-3
            "
          >
            {filteredRecords.map((record) => (
              <PurchaseCard
                key={record._id || record.id}
                record={record}
                onClick={handleRecordClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* ===================================================
          DETAIL MODAL
      =================================================== */}

      {selectedRecord && (
        <MaintenanceDetailModal
          type="purchase"
          record={selectedRecord}
          onClose={handleCloseModal}
        />
      )}

      {showForm && (
        <PurchaseSection
          form={purchaseForm}
          onChange={handlePurchaseChange}
          onGuaranteeCamera={() => openCamera("guarantee-photo")}
          onGuaranteeFile={handleGuaranteeFile}
          onRemoveGuarantee={removeGuaranteePhoto}
          onOtherCamera={() => openCamera("purchase-image")}
          onOtherFiles={handlePurchaseFiles}
          onRemoveOther={removePurchaseImage}
          onCancel={closeForm}
          onSubmit={handleSubmit}
        />
      )}

      <AnimatePresence>
        {showCamera && (
          <CameraCapture
            documentType={cameraDocument}
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Purchase;
