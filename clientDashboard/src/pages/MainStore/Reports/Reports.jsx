import { useEffect, useMemo, useState } from "react";

import Card from "../../../components/shared/ui/Card";
import Button from "../../../components/shared/ui/Button";

import {
  getRequirementReportOptions,
  downloadRequirementReport,
} from "../../../services/report.service";
import ThemeProvider from "../../../components/shared/ui/ThemeProvider";
import PageHeader from "../../../components/shared/ui/PageHeader";
import { themes } from "../../../components/shared/ui/Theme";

const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [itemSearch, setItemSearch] = useState("");

  const [options, setOptions] = useState({
    kitchens: [],
    items: [],
    districts: [],
  });

  const [filters, setFilters] = useState({
    dateType: "single",

    date: getToday(),
    fromDate: getToday(),
    toDate: getToday(),

    district: "",
    kitchen: "",
    items: [],

    status: "requested",
  });

  /*
   * ============================================================
   * LOAD REPORT OPTIONS
   * ============================================================
   */
  useEffect(() => {
    loadReportOptions();
  }, [
    filters.dateType,
    filters.date,
    filters.fromDate,
    filters.toDate,
    filters.district,
    filters.kitchen,
  ]);

  const loadReportOptions = async () => {
    try {
      const fromDate =
        filters.dateType === "single"
          ? filters.date
          : filters.fromDate;

      const toDate =
        filters.dateType === "single"
          ? filters.date
          : filters.toDate;

      if (!fromDate || !toDate) {
        return;
      }

      if (
        filters.dateType === "range" &&
        fromDate > toDate
      ) {
        return;
      }

      setOptionsLoading(true);

      const data = await getRequirementReportOptions({
        fromDate,
        toDate,
        district: filters.district || undefined,
        kitchen: filters.kitchen || undefined,
      });

      setOptions({
        kitchens: data?.kitchens || [],
        items: data?.items || [],
        districts: data?.districts || [],
      });
    } catch (error) {
      console.error(
        "Failed to load report options:",
        error,
      );

      setOptions({
        kitchens: [],
        items: [],
        districts: [],
      });
    } finally {
      setOptionsLoading(false);
    }
  };

  /*
   * ============================================================
   * FILTER ITEMS BY SEARCH
   * ============================================================
   */
  const filteredItems = useMemo(() => {
    const search = itemSearch.trim().toLowerCase();

    if (!search) {
      return options.items;
    }

    return options.items.filter((item) =>
      item.name?.toLowerCase().includes(search),
    );
  }, [options.items, itemSearch]);

  /*
   * ============================================================
   * HANDLE NORMAL INPUT CHANGE
   * ============================================================
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => {
      /*
       * Date changed
       */
      if (
        name === "date" ||
        name === "fromDate" ||
        name === "toDate"
      ) {
        setItemSearch("");

        return {
          ...prev,
          [name]: value,
          district: "",
          kitchen: "",
          items: [],
        };
      }

      /*
       * District changed
       */
      if (name === "district") {
        setItemSearch("");

        return {
          ...prev,
          district: value,
          kitchen: "",
          items: [],
        };
      }

      /*
       * Kitchen changed
       */
      if (name === "kitchen") {
        setItemSearch("");

        return {
          ...prev,
          kitchen: value,
          items: [],
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  /*
   * ============================================================
   * DATE TYPE CHANGE
   * ============================================================
   */
  const handleDateTypeChange = (type) => {
    setItemSearch("");

    setFilters((prev) => ({
      ...prev,

      dateType: type,

      date: prev.date || getToday(),

      fromDate:
        prev.fromDate ||
        prev.date ||
        getToday(),

      toDate:
        prev.toDate ||
        prev.date ||
        getToday(),

      district: "",
      kitchen: "",
      items: [],
    }));
  };

  /*
   * ============================================================
   * ITEM TOGGLE
   * ============================================================
   */
  const handleItemToggle = (itemId) => {
    setFilters((prev) => {
      const alreadySelected =
        prev.items.includes(itemId);

      return {
        ...prev,

        items: alreadySelected
          ? prev.items.filter(
              (id) => id !== itemId,
            )
          : [...prev.items, itemId],
      };
    });
  };

  /*
   * ============================================================
   * SELECT ALL ITEMS
   * ============================================================
   *
   * Empty array means all items.
   */
  const handleSelectAllItems = () => {
    setFilters((prev) => ({
      ...prev,
      items: [],
    }));

    setItemSearch("");
  };

  /*
   * ============================================================
   * DOWNLOAD REPORT
   * ============================================================
   */
  const handleDownload = async () => {
    try {
      const fromDate =
        filters.dateType === "single"
          ? filters.date
          : filters.fromDate;

      const toDate =
        filters.dateType === "single"
          ? filters.date
          : filters.toDate;

      /*
       * Validate dates
       */
      if (!fromDate || !toDate) {
        alert("Please select a date.");
        return;
      }

      if (
        filters.dateType === "range" &&
        fromDate > toDate
      ) {
        alert(
          "From Date cannot be greater than To Date.",
        );
        return;
      }

      /*
       * Status is required because UI
       * currently supports only:
       *
       * requested
       * dispatched
       */
      if (!filters.status) {
        alert("Please select a status.");
        return;
      }

      setLoading(true);

      const payload = {
        dateType: filters.dateType,

        fromDate,
        toDate,

        district:
          filters.district || "",

        kitchen:
          filters.kitchen || "",

        items: filters.items,

        status:
          filters.status,
      };

      console.log(
        "Requirement report payload:",
        payload,
      );

      const blob =
        await downloadRequirementReport(
          payload,
        );

      /*
       * ========================================================
       * CREATE DOWNLOAD URL
       * ========================================================
       */
      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      /*
       * ========================================================
       * FILE NAME
       * ========================================================
       */
      const statusName =
        filters.status === "dispatched"
          ? "dispatched"
          : "requested";

      if (
        filters.dateType === "single"
      ) {
        link.download =
          `${statusName}-requirements-${filters.date}.xlsx`;
      } else {
        link.download =
          `${statusName}-requirements-${filters.fromDate}-to-${filters.toDate}.xlsx`;
      }

      document.body.appendChild(link);

      link.click();

      link.remove();

      /*
       * Release browser memory
       */
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Failed to download report:",
        error,
      );

      alert(
        error.response?.data?.message ||
          "Unable to download report.",
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ============================================================
   * SELECTED ITEM NAMES
   * ============================================================
   */
  const selectedItemNames = options.items
    .filter((item) =>
      filters.items.includes(item._id),
    )
    .map((item) => item.name);

  /*
   * ============================================================
   * SELECTED DISTRICT NAME
   * ============================================================
   */
  const selectedDistrictName =
    options.districts.find((district) => {
      const districtId =
        typeof district === "string"
          ? district
          : district._id;

      return (
        districtId === filters.district
      );
    });

  /*
   * ============================================================
   * SELECTED KITCHEN NAME
   * ============================================================
   */
  const selectedKitchenName =
    options.kitchens.find(
      (kitchen) =>
        kitchen._id ===
        filters.kitchen,
    )?.name;

  return (
    <div className="space-y-6">
       <ThemeProvider
      theme={themes.EXCEL_REPORT}
      className="min-h-full pb-24"
    >
      {/* ======================================================
          HEADER
      ====================================================== */}
        <PageHeader
            title="Requirements Reports"
            subtitle="Generate and download requirement
            reports in Excel format."
            imageUrl={'/ui/EXCEL.png'}
          />
      {/* ======================================================
          FILTERS
      ====================================================== */}
      <Card>
        <div className="space-y-6">
          {/* ==================================================
              DATE TYPE
          ================================================== */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Date Selection
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  handleDateTypeChange(
                    "single",
                  )
                }
                className={`border rounded-xl p-3 text-sm font-medium transition ${
                  filters.dateType ===
                  "single"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Single Date
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDateTypeChange(
                    "range",
                  )
                }
                className={`border rounded-xl p-3 text-sm font-medium transition ${
                  filters.dateType ===
                  "range"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Date Range
              </button>
            </div>
          </div>

          {/* ==================================================
              SINGLE DATE
          ================================================== */}
          {filters.dateType ===
            "single" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Date
              </label>

              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleChange}
                className="w-full border rounded-xl p-3"
              />
            </div>
          )}

          {/* ==================================================
              DATE RANGE
          ================================================== */}
          {filters.dateType ===
            "range" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  From Date
                </label>

                <input
                  type="date"
                  name="fromDate"
                  value={filters.fromDate}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  To Date
                </label>

                <input
                  type="date"
                  name="toDate"
                  value={filters.toDate}
                  min={filters.fromDate}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-3"
                />
              </div>
            </div>
          )}

          {/* ==================================================
              DISTRICT
          ================================================== */}
          <div>
            <label className="block text-sm font-medium mb-2">
              District
            </label>

            <select
              name="district"
              value={filters.district}
              onChange={handleChange}
              disabled={optionsLoading}
              className="w-full border rounded-xl p-3 bg-white disabled:bg-gray-100"
            >
              <option value="">
                All Districts
              </option>

              {options.districts.map(
                (district) => {
                  const value =
                    typeof district ===
                    "string"
                      ? district
                      : district._id;

                  const label =
                    typeof district ===
                    "string"
                      ? district
                      : district.name;

                  return (
                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>
                  );
                },
              )}
            </select>
          </div>

          {/* ==================================================
              KITCHEN
          ================================================== */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Kitchen
            </label>

            <select
              name="kitchen"
              value={filters.kitchen}
              onChange={handleChange}
              disabled={optionsLoading}
              className="w-full border rounded-xl p-3 bg-white disabled:bg-gray-100"
            >
              <option value="">
                All Kitchens
              </option>

              {options.kitchens.map(
                (kitchen) => (
                  <option
                    key={kitchen._id}
                    value={kitchen._id}
                  >
                    {kitchen.name}
                  </option>
                ),
              )}
            </select>
          </div>

          {/* ==================================================
              ITEMS
          ================================================== */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">
                Items
              </label>

              {filters.items.length > 0 && (
                <button
                  type="button"
                  onClick={
                    handleSelectAllItems
                  }
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Select All
                </button>
              )}
            </div>

            <div className="border rounded-xl bg-white overflow-hidden">
              {/* ==============================================
                  SEARCH BAR
              ============================================== */}
              <div className="p-3 border-b bg-gray-50">
                <div className="relative">
                  <input
                    type="text"
                    value={itemSearch}
                    onChange={(e) =>
                      setItemSearch(
                        e.target.value,
                      )
                    }
                    placeholder="Search items..."
                    className="w-full border rounded-lg p-2.5 pr-10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {itemSearch && (
                    <button
                      type="button"
                      onClick={() =>
                        setItemSearch("")
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-lg"
                      aria-label="Clear item search"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* ==============================================
                  ALL ITEMS
              ============================================== */}
              <label
                className={`flex items-center gap-3 p-3 border-b cursor-pointer hover:bg-gray-50 ${
                  filters.items.length === 0
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={
                    filters.items.length === 0
                  }
                  onChange={
                    handleSelectAllItems
                  }
                  className="h-4 w-4"
                />

                <span className="text-sm font-medium">
                  All Items
                </span>
              </label>

              {/* ==============================================
                  ITEM LIST
              ============================================== */}
              <div className="max-h-64 overflow-y-auto">
                {options.items.length ===
                0 ? (
                  <p className="p-4 text-sm text-gray-500">
                    {optionsLoading
                      ? "Loading items..."
                      : "No items found for the selected filters."}
                  </p>
                ) : filteredItems.length ===
                  0 ? (
                  <p className="p-4 text-sm text-gray-500">
                    No items match "
                    {itemSearch}".
                  </p>
                ) : (
                  filteredItems.map(
                    (item) => {
                      const checked =
                        filters.items.includes(
                          item._id,
                        );

                      return (
                        <label
                          key={item._id}
                          className={`flex items-center gap-3 p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                            checked
                              ? "bg-blue-50"
                              : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              handleItemToggle(
                                item._id,
                              )
                            }
                            className="h-4 w-4"
                          />

                          <span className="text-sm">
                            {item.name}
                          </span>
                        </label>
                      );
                    },
                  )
                )}
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              {filters.items.length ===
              0
                ? "All items will be included."
                : `${filters.items.length} item${
                    filters.items.length >
                    1
                      ? "s"
                      : ""
                  } selected`}
            </p>
          </div>

          {/* ==================================================
              STATUS
          ================================================== */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Status
            </label>

            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="w-full border rounded-xl p-3 bg-white"
            >
              <option value="requested">
                Requested
              </option>

              <option value="dispatched">
                Dispatched
              </option>
            </select>

            <p className="text-xs text-gray-500 mt-2">
              {filters.status ===
                "requested" &&
                "Report will include Submitted requirements and use requested quantity."}

              {filters.status ===
                "dispatched" &&
                "Report will include Out For Delivery and Received requirements and use dispatched quantity."}
            </p>
          </div>

          {/* ==================================================
              LOADING
          ================================================== */}
          {optionsLoading && (
            <p className="text-sm text-gray-500">
              Loading kitchens, items and
              districts...
            </p>
          )}

          {/* ==================================================
              SUMMARY
          ================================================== */}
          <div className="rounded-xl bg-gray-50 border p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Report Summary
            </p>

            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <span className="font-medium">
                  Date:
                </span>{" "}
                {filters.dateType ===
                "single"
                  ? filters.date
                  : `${filters.fromDate} → ${filters.toDate}`}
              </p>

              <p>
                <span className="font-medium">
                  District:
                </span>{" "}
                {filters.district
                  ? typeof selectedDistrictName ===
                    "string"
                    ? selectedDistrictName
                    : selectedDistrictName
                        ?.name ||
                      "Selected District"
                  : "All Districts"}
              </p>

              <p>
                <span className="font-medium">
                  Kitchen:
                </span>{" "}
                {filters.kitchen
                  ? selectedKitchenName ||
                    "Selected Kitchen"
                  : "All Kitchens"}
              </p>

              <p>
                <span className="font-medium">
                  Items:
                </span>{" "}
                {filters.items.length ===
                0
                  ? "All Items"
                  : selectedItemNames.join(
                      ", ",
                    )}
              </p>

              <p>
                <span className="font-medium">
                  Status:
                </span>{" "}
                {filters.status ===
                  "requested" &&
                  "Requested"}

                {filters.status ===
                  "dispatched" &&
                  "Dispatched"}
              </p>
            </div>
          </div>

          {/* ==================================================
              DOWNLOAD
          ================================================== */}
          <Button
            className="w-full"
            onClick={handleDownload}
            disabled={
              loading ||
              optionsLoading
            }
          >
            {loading
              ? "Generating Report..."
              : "Download Excel"}
          </Button>
        </div>
      </Card>
      </ThemeProvider>
    </div>
  );
};

export default Reports;
