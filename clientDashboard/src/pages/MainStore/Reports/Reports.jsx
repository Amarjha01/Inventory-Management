import { useEffect, useState } from "react";

import Card from "../../../components/shared/ui/Card";
import Button from "../../../components/shared/ui/Button";

import {
  getRequirementReportOptions,
  downloadRequirementReport,
} from "../../../services/report.service";

const getToday = () => new Date().toISOString().split("T")[0];

const Reports = () => {
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(false);

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

    kitchen: "",
    items: [],
    district: "",

    status: "",
  });

  useEffect(() => {
    loadReportOptions();
  }, []);

  useEffect(() => {
    loadReportOptions();
  }, [
    filters.dateType,
    filters.date,
    filters.fromDate,
    filters.toDate,
  ]);

  const loadReportOptions = async () => {
    try {
      setOptionsLoading(true);

      const fromDate =
        filters.dateType === "single"
          ? filters.date
          : filters.fromDate;

      const toDate =
        filters.dateType === "single"
          ? filters.date
          : filters.toDate;

      if (!fromDate || !toDate) return;

      if (
        filters.dateType === "range" &&
        fromDate > toDate
      ) {
        return;
      }

      const data = await getRequirementReportOptions({
        fromDate,
        toDate,
      });

      setOptions({
        kitchens: data?.kitchens || [],
        items: data?.items || [],
        districts: data?.districts || [],
      });

      // Reset selected items when date range changes
      setFilters((prev) => ({
        ...prev,
        items: [],
      }));
    } catch (error) {
      console.error(error);

      setOptions({
        kitchens: [],
        items: [],
        districts: [],
      });
    } finally {
      setOptionsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateTypeChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      dateType: type,

      date: prev.date || getToday(),

      fromDate: prev.fromDate || prev.date || getToday(),
      toDate: prev.toDate || prev.date || getToday(),

      kitchen: "",
      items: [],
      district: "",
    }));
  };

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

  const handleSelectAllItems = () => {
    setFilters((prev) => ({
      ...prev,
      items: [],
    }));
  };

  const handleDownload = async () => {
    try {
      if (
        filters.dateType === "range" &&
        filters.fromDate > filters.toDate
      ) {
        alert(
          "From Date cannot be greater than To Date.",
        );

        return;
      }

      setLoading(true);

     const payload = {
  dateType: filters.dateType,

  fromDate:
    filters.dateType === "single"
      ? filters.date
      : filters.fromDate,

  toDate:
    filters.dateType === "single"
      ? filters.date
      : filters.toDate,

  kitchen: filters.kitchen,

  items: filters.items,

  district: filters.district,

  status: filters.status,
};


      const blob =
        await downloadRequirementReport(payload);

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      if (filters.dateType === "single") {
        link.download = `Requirements-${filters.date}.xlsx`;
      } else {
        link.download = `Requirements-${filters.fromDate}-to-${filters.toDate}.xlsx`;
      }

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to download report.",
      );
    } finally {
      setLoading(false);
    }
  };

  const selectedItemNames = options.items
    .filter((item) =>
      filters.items.includes(item._id),
    )
    .map((item) => item.name);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div>
          <h1 className="text-2xl font-bold">
            Requirements Reports
          </h1>

          <p className="text-gray-500 mt-1">
            Generate and download requirement
            reports in Excel format.
          </p>
        </div>
      </Card>

      {/* Filters */}
      <Card>
        <div className="space-y-6">
          {/* Date Type */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Date Selection
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  handleDateTypeChange("single")
                }
                className={`border rounded-xl p-3 text-sm font-medium transition ${
                  filters.dateType === "single"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Single Date
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDateTypeChange("range")
                }
                className={`border rounded-xl p-3 text-sm font-medium transition ${
                  filters.dateType === "range"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Date Range
              </button>
            </div>
          </div>

          {/* Single Date */}
          {filters.dateType === "single" && (
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

          {/* Date Range */}
          {filters.dateType === "range" && (
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

          {/* Kitchen */}
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

              {options.kitchens.map((kitchen) => (
                <option
                  key={kitchen._id}
                  value={kitchen._id}
                >
                  {kitchen.name}
                </option>
              ))}
            </select>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">
                Items
              </label>

              {filters.items.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectAllItems}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Select All
                </button>
              )}
            </div>

            <div className="border rounded-xl bg-white overflow-hidden">
              {/* All Items */}
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

              {/* Item List */}
              <div className="max-h-64 overflow-y-auto">
                {options.items.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500">
                    {optionsLoading
                      ? "Loading items..."
                      : "No items found for the selected date."}
                  </p>
                ) : (
                  options.items.map((item) => {
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
                  })
                )}
              </div>
            </div>

            {/* Selected items */}
            <p className="text-xs text-gray-500 mt-2">
              {filters.items.length === 0
                ? "All items will be included."
                : `${filters.items.length} item${
                    filters.items.length > 1
                      ? "s"
                      : ""
                  } selected`}
            </p>
          </div>

          {/* District */}
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
                    typeof district === "string"
                      ? district
                      : district._id;

                  const label =
                    typeof district === "string"
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

          {/* Status */}
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
              <option value="">
                All Statuses
              </option>

              <option value="Submitted">
                Submitted
              </option>

              <option value="Out For Delivery">
                Out For Delivery
              </option>

              <option value="Received">
                Received
              </option>
            </select>
          </div>

          {/* Loading */}
          {optionsLoading && (
            <p className="text-sm text-gray-500">
              Loading kitchens, items and
              districts...
            </p>
          )}

          {/* Summary */}
          <div className="rounded-xl bg-gray-50 border p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Report Summary
            </p>

            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <span className="font-medium">
                  Date:
                </span>{" "}
                {filters.dateType === "single"
                  ? filters.date
                  : `${filters.fromDate} → ${filters.toDate}`}
              </p>

              <p>
                <span className="font-medium">
                  Kitchen:
                </span>{" "}
                {filters.kitchen
                  ? options.kitchens.find(
                      (kitchen) =>
                        kitchen._id ===
                        filters.kitchen,
                    )?.name ||
                    "Selected Kitchen"
                  : "All Kitchens"}
              </p>

              <p>
                <span className="font-medium">
                  Items:
                </span>{" "}
                {filters.items.length === 0
                  ? "All Items"
                  : selectedItemNames.join(", ")}
              </p>

              <p>
                <span className="font-medium">
                  District:
                </span>{" "}
                {filters.district ||
                  "All Districts"}
              </p>

              <p>
                <span className="font-medium">
                  Status:
                </span>{" "}
                {filters.status ||
                  "All Statuses"}
              </p>
            </div>
          </div>

          {/* Download */}
          <Button
            className="w-full"
            onClick={handleDownload}
            disabled={
              loading || optionsLoading
            }
          >
            {loading
              ? "Generating Report..."
              : "Download Excel"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
