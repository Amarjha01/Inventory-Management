import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiCalendar,
  FiChevronDown,
  FiFilter,
  FiRefreshCw,
  FiSearch,
  FiUsers,
  FiX,
} from "react-icons/fi";

import VisitorCard from "../../../components/mainStore/maintenance/VisitorCard.jsx";
import MaintenanceDetailModal from "../../../components/mainStore/maintenance/MaintenanceDetailModal.jsx";
import { getAllVisitorForAdmin } from "../../../services/maintainence.service.js";


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

  if (
    record.kitchenId &&
    typeof record.kitchenId === "object"
  ) {
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

const normalizeVisitorRecord = (record) => {
  if (!record) return null;

  const visitorData =
    record.visitor &&
    typeof record.visitor === "object"
      ? record.visitor
      : record;

  return {
    ...record,
    ...visitorData,

    _id:
      record._id ||
      visitorData._id,

    kitchenId:
      record.kitchenId ||
      visitorData.kitchenId,

    userId:
      record.userId ||
      visitorData.userId,

    createdAt:
      record.createdAt ||
      visitorData.createdAt,

    updatedAt:
      record.updatedAt ||
      visitorData.updatedAt,

    kitchenName:
      getKitchenName(record),

    visitor: visitorData,
  };
};


/* =========================================================
   COMPONENT
========================================================= */

const Visitor = () => {

  /* -------------------------------------------------------
     DATA
  ------------------------------------------------------- */

  const [records, setRecords] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* -------------------------------------------------------
     SEARCH
  ------------------------------------------------------- */

  const [search, setSearch] =
    useState("");


  /* -------------------------------------------------------
     FILTERS
  ------------------------------------------------------- */

  const [showFilters, setShowFilters] =
    useState(false);

  const [selectedKitchen, setSelectedKitchen] =
    useState("ALL");

  const [selectedStatus, setSelectedStatus] =
    useState("ALL");

  const [dateFrom, setDateFrom] =
    useState("");

  const [dateTo, setDateTo] =
    useState("");


  /* -------------------------------------------------------
     SELECTED RECORD
  ------------------------------------------------------- */

  const [selectedRecord, setSelectedRecord] =
    useState(null);


  /* =======================================================
     FETCH VISITOR RECORDS
  ======================================================= */

  const fetchRecords = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getAllVisitorForAdmin();

        console.log(
          "VISITOR RECORDS RESPONSE:",
          response
        );

        let data = response;

        /*
         * Handles:
         *
         * [...]
         *
         * or:
         *
         * {
         *   data: [...]
         * }
         */

        if (
          response?.data &&
          Array.isArray(response.data)
        ) {
          data = response.data;
        }

        if (!Array.isArray(data)) {
          data = [];
        }

        const normalized =
          data
            .map(normalizeVisitorRecord)
            .filter(Boolean);

        setRecords(normalized);

      } catch (err) {

        console.error(
          "Failed to fetch visitor records:",
          err
        );

        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load visitor records."
        );

      } finally {
        setLoading(false);
      }
    },
    []
  );


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

      const kitchenId =
        getId(record.kitchenId);

      const kitchenName =
        record.kitchenName ||
        getKitchenName(record);


      if (kitchenId) {

        map.set(kitchenId, {
          id: kitchenId,
          name: kitchenName,
        });

      } else if (
        kitchenName !==
        "Unknown Kitchen"
      ) {

        map.set(kitchenName, {
          id: kitchenName,
          name: kitchenName,
        });

      }

    });


    return Array
      .from(map.values())
      .sort((a, b) =>
        a.name.localeCompare(b.name)
      );

  }, [records]);


  /* =======================================================
     FILTERED RECORDS
  ======================================================= */

  const filteredRecords = useMemo(() => {

    const normalizedSearch =
      search.trim().toLowerCase();


    return records.filter((record) => {

      /* ---------------------------------------------------
         SEARCH
      --------------------------------------------------- */

      if (normalizedSearch) {

        const visitor =
          record.visitor ||
          record;


        const searchableText = [

          visitor.visitorName,

          visitor.name,

          visitor.phone,

          visitor.phoneNumber,

          visitor.mobile,

          visitor.reason,

          visitor.narration,

          visitor.feedback,

          record.kitchenName,

          record.kitchenId?.name,

          record.userId?.name,

          record.userId?.username,

        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();


        if (
          !searchableText.includes(
            normalizedSearch
          )
        ) {
          return false;
        }

      }


      /* ---------------------------------------------------
         KITCHEN FILTER
      --------------------------------------------------- */

      if (
        selectedKitchen !==
        "ALL"
      ) {

        const recordKitchenId =
          getId(record.kitchenId);

        const recordKitchenName =
          record.kitchenName ||
          getKitchenName(record);


        if (
          recordKitchenId !==
            selectedKitchen &&
          recordKitchenName !==
            selectedKitchen
        ) {
          return false;
        }

      }


      /* ---------------------------------------------------
         STATUS FILTER
      --------------------------------------------------- */

      if (
        selectedStatus !==
        "ALL"
      ) {

        const recordStatus =
          String(
            record.status || ""
          ).toUpperCase();


        if (
          recordStatus !==
          selectedStatus
        ) {
          return false;
        }

      }


      /* ---------------------------------------------------
         DATE FROM
      --------------------------------------------------- */

      if (
        dateFrom &&
        record.problemDate
      ) {

        const problemDate =
          new Date(
            record.problemDate
          );

        const fromDate =
          new Date(
            `${dateFrom}T00:00:00`
          );


        if (
          problemDate <
          fromDate
        ) {
          return false;
        }

      }


      /* ---------------------------------------------------
         DATE TO
      --------------------------------------------------- */

      if (
        dateTo &&
        record.problemDate
      ) {

        const problemDate =
          new Date(
            record.problemDate
          );

        const toDate =
          new Date(
            `${dateTo}T23:59:59`
          );


        if (
          problemDate >
          toDate
        ) {
          return false;
        }

      }


      return true;

    });

  }, [
    records,
    search,
    selectedKitchen,
    selectedStatus,
    dateFrom,
    dateTo,
  ]);


  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters = () => {

    setSelectedKitchen("ALL");

    setSelectedStatus("ALL");

    setDateFrom("");

    setDateTo("");

    setSearch("");

  };


  const hasActiveFilters =
    selectedKitchen !== "ALL" ||
    selectedStatus !== "ALL" ||
    dateFrom ||
    dateTo ||
    search;


  /* =======================================================
     CARD CLICK
  ======================================================= */

  const handleRecordClick = (
    record
  ) => {
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

        <div className="mb-6 animate-pulse">

          <div
            className="
              h-11
              rounded-xl
              bg-slate-200
            "
          />

        </div>


        {/* Cards skeleton */}

        <div
          className="
            grid
            gap-4
            sm:grid-cols-2
            xl:grid-cols-3
          "
        >

          {Array
            .from({ length: 6 })
            .map((_, index) => (

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

            <FiUsers
              size={20}
              className="text-red-500"
            />

          </div>


          <h2
            className="
              mt-4
              text-sm
              font-bold
              text-slate-900
            "
          >
            Unable to load visitor records
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

            <FiRefreshCw
              size={14}
            />

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
            TOP TOOLBAR
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
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="
                  Search visitor records...
                "
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"/>

              {search && (

                <button
                  type="button"
                  onClick={() =>
                    setSearch("")
                  }
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

                  <FiX
                    size={15}
                  />

                </button>

              )}

            </div>


            {/* FILTER */}

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (previous) =>
                    !previous
                )
              }
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
                  showFilters ||
                  hasActiveFilters
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

              <FiFilter
                size={15}
              />

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

              <FiRefreshCw
                size={15}
              />

              <span className="hidden sm:inline">
                Refresh
              </span>

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
                      visitor-kitchen-filter
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
                        visitor-kitchen-filter
                      "
                      value={selectedKitchen}
                      onChange={(event) =>
                        setSelectedKitchen(
                          event.target.value
                        )
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

                      <option value="ALL">
                        All Kitchens
                      </option>


                      {kitchens.map(
                        (kitchen) => (

                          <option
                            key={kitchen.id}
                            value={kitchen.id}
                          >
                            {kitchen.name}
                          </option>

                        )
                      )}

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


                {/* STATUS */}

                <div>

                  <label
                    htmlFor="
                      visitor-status-filter
                    "
                    className="
                      mb-1.5
                      block
                      text-[11px]
                      font-semibold
                      text-slate-500
                    "
                  >
                    Status
                  </label>


                  <div className="relative">

                    <select
                      id="
                        visitor-status-filter
                      "
                      value={selectedStatus}
                      onChange={(event) =>
                        setSelectedStatus(
                          event.target.value
                        )
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

                      <option value="ALL">
                        All Status
                      </option>

                      <option value="PENDING">
                        Pending
                      </option>

                      <option value="COMPLETED">
                        Completed
                      </option>

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
                      visitor-date-from
                    "
                    className="
                      mb-1.5
                      block
                      text-[11px]
                      font-semibold
                      text-slate-500
                    "
                  >
                    Visitor Date From
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
                        visitor-date-from
                      "
                      type="date"
                      value={dateFrom}
                      onChange={(event) =>
                        setDateFrom(
                          event.target.value
                        )
                      }
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
                      visitor-date-to
                    "
                    className="
                      mb-1.5
                      block
                      text-[11px]
                      font-semibold
                      text-slate-500
                    "
                  >
                    Visitor Date To
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
                        visitor-date-to
                      "
                      type="date"
                      value={dateTo}
                      onChange={(event) =>
                        setDateTo(
                          event.target.value
                        )
                      }
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


              {/* CLEAR FILTERS */}

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
                    onClick={
                      clearFilters
                    }
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
              Visitor Records
            </h2>


            <p
              className="
                mt-0.5
                text-[11px]
                text-slate-400
              "
            >
              {filteredRecords.length}{" "}
              {filteredRecords.length === 1
                ? "record"
                : "records"}
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

                <FiUsers
                  size={22}
                  className="text-slate-400"
                />

              </div>


              <h3
                className="
                  mt-4
                  text-sm
                  font-bold
                  text-slate-900
                "
              >
                No visitor records found
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
                  : "There are no visitor records available yet."}
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

            {filteredRecords.map(
              (record) => (

                <VisitorCard
                  key={
                    record._id ||
                    record.id
                  }
                  record={record}
                  onClick={
                    handleRecordClick
                  }
                />

              )
            )}

          </div>

        )}

      </div>


      {/* ===================================================
          DETAIL MODAL
      =================================================== */}

      {selectedRecord && (

        <MaintenanceDetailModal
          type="visitor"
          record={selectedRecord}
          onClose={
            handleCloseModal
          }
        />

      )}

    </>

  );
};


export default Visitor;